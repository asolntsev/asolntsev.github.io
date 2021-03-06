---
layout: post
category: ru
title: Где спряталась логика?
---

### Вопрос

Очень часто при обсуждении программ употребляется термин «логика» или «бизнес-логика». 
Например:

* (о юнит-тестах) не обязательно добиваться стопроцентного покрытия кода тестами, достаточно тестировать лишь **логику**.
* (о веб-приложениях) контроллер не должен содержать никакой **бизнес-логики**, а должен только вызывать методы других классов
* В слое VIEW (то есть в JSP-файлах) не должно быть **бизнес-логики**

Так вот, кто скажет мне, что такое «логика»?

<!--more-->

Надо ли понимать под этим любой IF в коде? Но разве бывает код без IF'ов? Или «бизнес-логика» означает любую информацию, которая исходит от клиента? Но разве можем мы на деньги клиента делать что-то, чего он не заказывал? Не можем. Стало быть, весь наш код — это целиком «бизнес-логика» от клиента. Вот поэтому я никогда не мог понять, что же такое эта чёртова логика.
 
### Ответ

Возможно, ответить на этот вопрос проще, если вместо слова «логика» использовать слово «знание». Логика — это любое знание о коде, или о том, как должен вести себя код. Можно ещё сформулировать так: «логика» — это всё, что вам хотелось хоть раз откомментировать. 

### Пример
    
Возьмём для примера класс Account, который я недавно откопал в своём проекте. 

Было это так. В один прекрасный день у нас в офисе отрубился интернет на пару часов. Работать я фактически не мог — ну там, svn, jira, база знаний и прочее не были доступны. И решил я в качестве упражнения написать юнит-тест для какого-нибудь класса. И наткнулся на `Account`:

```java
public class Account {
  // Негативное значение означает, что счёт предоплачен
  private BigDecimal amount;
  public BigDecimal getAmount() {
    return amount;
  }

  // И ещё два десятка геттеров и сеттеров
}
```

Казалось бы, что тут тестировать? Где IF'ы? Где тут логика? Казалось бы, нет её, и тестировать нечего. Я уже хотел было бросить этот класс и найти что-нибудь посложнее, как вдруг заметил комментарий около переменной amount:

> Негативное значение означает, что счёт предоплачен

Это что ещё такое? 
Получается, что «amount» — это суммарная задолженность данного клиента, а если клиент внёс предоплату, то 
эта «задолженность» со знаком минус. Ну вот, это уже какое-то знание о коде. Попробуем-ка 
[превратить этот комментарий в юнит-тест](http://habrahabr.ru/blogs/tdd/97320/):

```java
public class AccountTest {
  @Test
  public void negativeAmountMeansThatAccountIsPrepaid() {
    Account prepaidAccount = new Account(-123);
    assertTrue(prepaidAccount.isPrepaid());
  }
}
```

Раз мы проверяем случай негативного «amount», хорошо бы проверить и случай позитивного:

```java
@Test
public void positiveAmountMeansThatAccountIsInDebt() {
  Account indebtAccount = new Account(456);
  assertFalse(indebtAccount.isPrepaid());
  assertTrue(indebtAccount.isInDebt());
}
```

Вот так ненароком у нас возникло два новых метода `isPrepaid()` и `isInDebt()`, реализация которых, конечно, очевидна:

```java
public class Account {
  private BigDecimal amount;
  public boolean isInDebt() {
    return amount > 0;
  }
  public boolean isPrepaid() {
    return amount < 0;
  }
}
```

Вот видите, уже и IF'ы появились в коде!
Следующая мысль, которая должна при этом прийти в голову: наверное, эти IF'ы уже были где-то раньше?

Пришлось немножко поискать, но это того стоило. 
Оказалось, что эти IF'ы действительно были в коде, причём не где-нибудь, а в JSP-файле, то есть в слое «view», в 
котором по определению никакой логики быть не должно:


```jsp
<% Positive amount means that account is in debt %>
<c:if test="${account.amount > 0}">
  <span style="color: red;">Оплатите задолженность!</span>
</c:if>
<c:if test="${account.amount < 0}">
  <span style="color: green;">Предоплата</span>
</c:if>
```

Опаньки, как интересно! Вот и мой второй тест-кейс всплыл. Как замечательно. 
Теперь, поскольку у нас есть методы `isInDebt()` и `isPrepaid()`, мы можем убрать логику из JSP: 

```jsp
<c:if test="${account.inDebt}">
 <span style="color: red;">Оплатите задолженность!</span>
</c:if>
<c:if test="${account.prepaid}">
  <span style="color: green;">Предоплата</span>
</c:if>
```

Стало лучше? Я думаю, что стало. Это уже чуть больше похоже на инкапсуляцию — скрытие реализации от посторонних глаз. Только класс Amount знает, в каком случае клиент должен или не должен денег. Никто больше в целом мире не знает, как это происходит — клиент получает уже готовое решение с помощью методов isInDebt и isPrepaid. Теоретически значения «долг» и «предоплата» вообще могут храниться в разных колонках базы данных, или даже вообще в разных таблицах и вообще в разных базах. Теперь благодаря наличию двух методов эта логика спрятана (инкапсулирована) в классе Account.

Если вы всё ещё не верите, сравните объём кода. 

**ДО**

```jsp
<%-- Негативное значение означает, что счёт предоплачен %-->
<c:if test="${account.amount > 0}">
  <span style="color: red;">Оплатите задолженность!</span>
</c:if>
```

**ПОСЛЕ**

```jsp
<c:if test="${account.inDebt}">
  <span style="color: red;">Оплатите задолженность!</span>
</c:if>
```

Можно пойти ещё дальше и вместо метода `getAmount()` сделать два разных метода `getPrepaidAmount()` и `getDoubt()`.
Причём внутри них можно проверять, действительно ли у клиента есть долг или предоплата. 
То есть теперь невозможно будет, например, написать такой код:

```jsp
<%-- Мало ли что у тебя предоплата, ты всё равно должен. %>
<c:if test="${account.amount != 0}">
  <font color="red">Оплатите задолженность!</font>
</c:if>
```

Да, это реальный код из того же проекта.
Взгляните на него ещё раз, взгляните внимательно. "Мало ли что у тебя предоплата". Блестяще! Вот где спраяталась аццкая логика!
Пойди пойми теперь, что там было у людей на уме - у людей, которые не писали юнит-тест.

В идеале метод `getAmount()` теперь можно вообще стереть. 
Это и есть настоящая инкапсуляция: скрыть данные и код и дать доступ только через методы. 
Я думаю, если бы интернет не починили, я бы избавился и от остальных 20 геттеров-сеттеров. 

### Мораль
    
Вот видите, как юнит-тесты приводят к читаемому, объектно-ориентированному коду. 
А вы говорите: «В моём коде нет логики, там нечего тестировать...» Ещё как есть! 

Логика есть, её не может не быть.