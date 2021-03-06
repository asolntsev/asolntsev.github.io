---
layout: post
category: ru
title: Что на самом деле нельзя хардкодить
---

### Хардкод

Это страшное слово - хардкод. Все боятся это сделать, но иногда каждый из нас это делает.

Но я утверждаю, что хардкод в привычном нам понимании вовсе не так уж страшен, 
и на самом деле гораздо страшнее, когда в коде прописывают _кое-что иное_. 

Так что же на самом деле нельзя хардкодить?

<!--more-->

### Классический хардкод

Все обычно считают, что 

* Нельзя хардкодить числа в коде! Надо вынести в константу.
* Нельзя хардкодить настройки в коде! Надо вынести в файл с настройками (а у некоторых и в базу данных).

То есть если джуниор девелопер напишет в коде `if (age >= 23)`, ему за это надо дать по рукам.
Так обычно считается.
Чтобы сберечь руки, он должен срочно вынести "23" в константу типа `MINIMUM_LOAN_AGE`.

### Давайте разбираться в причинах

А почему плохо прописать в коде "23"?

Обычно называют две причины. Их втирают нам в сознание ещё с университетской скамьи.  

1. Когда нужно будет поменять "23" на "24", её придётся поменять во многих файлах - трудоёмко.

2. Само по себе "23" плохо читается. Что означает "23" - возраст, длину волос, объём бензобака?
Почему именно 23, а не 22 или 24?


### Почему эти причины не катят?

Эти причины настолько нам привычны, что мы даже не задумываемся, насколько они актуальны в наше время. 
Вы удивитесь, но не очень-то актуальны. Прямо скажем, они _устарели_. Смотрите сами. 
 
1. Во всех современных IDE очень легко поменять "23" на "24". Одной кнопкой. Ctrl+R -> Enter. Всё. 
Хоть у тебя в проекте три файла, хоть три миллиона.

2. Да, "23" плохо читается. Но часто при вынесении в константу оно не становится более читаемым. 
Да, название константы `MINIMUM_LOAN_AGE` говорит о том, что это минимальный возраст, с которого можно
брать кредит. Но и выражение `if (age >= 23)` в методе `canRequestLoan()` говорит ровно о том же ничуть не хуже.
 
А почему именно 23, почему не 22 или 24 - это всё равно непонятно.
Чтобы это узнать, в наше время легче заглянуть в историю изменений (git -> annotate)
или в тесты (Ctrl+Shift+T) - с нашими IDE это легко.

### Ладно, ладно

Я знаю, вас переполняют эмоции. Вы хотели бы вбить мне в грудь осиновый кол за такую ересь.
Но потерпите, сейчас мы дойдём до главного.

Конечно, всё-таки выносить такие штуки в константы иногда полезно.

НО

Я хотел сказать, что самый страшный хардкод - это _вовсе не константы_.

### А что же - самый страшный хардкод?

Вглядитесь внимательно в это выражение. Все обычно думают, что самый страшный хардкод - это вот:
![Hardcode](/public/img/hardcode-constant.jpg)

Но вглядитесь, неужели это действительно самое страшное место? Оглядитесь вокруг, не притаилось ли рядом что-то более опасное?
На самом деле самая страшная часть - это вот:
![Hardcode](/public/img/hardcode-logic.jpg)

Потому, что вот её-то поменять во всём коде на порядок сложнее.
Когда однажды выяснится, что для получения кредита нужно стать старше 23 лет, да ещё и найти работу,
нам придётся найти в коде все места, где прописано `if (age >= 23)` и поменять их на 
`if (age > 23 && employed)`. Но как найти все знаки все знаки `>=`? Их же тысячи! Вот это ручная работа на столетия!

Но самое страшное, что в коде могут быть и выражения вида 

* `if (!(age < 23))`, и 
* `if (23 > age)`, 

и даже такие места, которые совсем нереально обнаружить: 

```java
if (age < 23) {
  // 100500 строк кода
}
else {
  // можно получить кредит
}
```


### Что же делать?

Вот почему важно выносить не константы, а логику.
Важно следить, чтобы любое знание в коде было прописано ровно в одном месте.
В данном случае - знание о том, в каких случаях клиент может взять кредит (то самое `>= 23`) 
должно быть вынесено в отдельный метод. 

Например, так:

```java
class User {
  public boolean canRequestLoan() {
    return age >= 23;
  }
}
```

И все остальные места должны использовать этот метод. 
Кажется тривиальным? О нет.
Если это знание действительно в одном месте, зачем вы так рьяно хотите вынести "23" в константу?

### Упростим

Всё ещё кажется тривиальным?
Ок, давайте упростим пример. Забудьте 23. Пусть будет 0.
  
Я уверен, в вашем коде миллион таких мест:

```java
  if (account.balance > 0) {
    // могу сделать платёж
  }
```

И я таких видел миллион. `if balance > 0` прописан и на странице 
платежей, и на странице кредитов, и депозитов, и т.д. 

Но однажды приходит новое требование: клиент не может сделать платёж, если на его счёт наложен арест.
Нам приходится добавить условие типа такого: 

```java
  if (account.balance > 0 && !account.arrested) {
    // могу сделать платёж
  }
```

Но тут... опачки. Оказывается, что в десяти местах прописано `if (balance > 0)`, в ещё двадцати - `if (balance <= 0)`,
а в грёбаном яваскрипте и вовсе `if (account.balance)`.
 
И вот тут-то начинаются проблемы. Все эти места нужно анализировать отдельно. 
В некоторые из них нужно добавить `&& !arrested`, а в некоторые не нужно - ведь там речь идёт не о платежах.

Я не придумываю, это абсолютно [реальный пример](/2011/03/03/wtf-is-business-logic/).

### Юнит-тесты

Очевидный плюс вынесения логики в методы - её легко тестировать.

Поначалу этот тест кажется даже избыточным и даже бесполезным:

```java
  public class AccountTest {
    @Test public void canMakePaymentIfHasMoney() {
      assertTrue(new Account(1).canMakePayment());
      assertFalse(new Account(-1).canMakePayment());
    }
  }
```

Но всё меняется, как только добавляются ньвые требования:

```java
  public class AccountTest {
    @Test public void canMakePayment_ifHasMoney_and_notArrested() {
      assertTrue(new Account(1, false).canMakePayment());
    }
    @Test public void cannotMakePaymentIfHasNoMoney() {
      assertFalse(new Account(-1, false).canMakePayment());
    }
    @Test public void cannotMakePaymentIfArrested() {
      assertFalse(new Account(1, true).canMakePayment());
    }
  }
```

### Пэдж обжекты

Всё ещё кажется, что для разумных людей это очевидные вещи?

Тогда посмотрите на [пэдж обжекты](/2016/07/09/true-page-object/) - воплощение константного антипаттерна во всей красе!
Миллионы людей выносят локаторы в константы и даже не задумываются, что что-то здесь не так... 

[Андрей Солнцев](https://twitter.com/asolntsev) 

[asolntsev.github.io](https://asolntsev.github.io/ru)
