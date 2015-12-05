---
layout: post
category: ru
title: Эволюция юнит-теста
---

Много слов сказано о том, как правильно писать юнит-тесты, и вообще о пользе TDD.
Потом ещё и какое-то BDD замаячило на горизонте. 
Приходится разбираться, что из них лучше и между ними какая разница. 
Может, это и есть причина, почему большинство разработчиков решили не заморачиваться и до сих пор не используют ни того, ни другого?

Коротко: BDD — это дальнейшее развитие идей TDD, стало быть, его и надо использовать. А разницу между TDD и BDD я попробую объяснить на простом примере. 

Рассмотрим 3 ревизии одного юнит-теста, который я нашёл в одном реальном проекте. Мы увидим, как он меняется от "обычного" до "хорошего" и "полезного". 

<!--more-->

### Попытка номер №1: типичный тест

Первая версия этого юнит-теста была такой:

```java
public class ReferenceNumberTest {  
  @Test  
  public void testValidate() {  
    assertFalse( ReferenceNumber.validate("1234567890123") );  
    assertFalse( ReferenceNumber.validate("1234567") );  
    assertTrue( ReferenceNumber.validate("12345678") );  
  }  
}
```
 
Мы называем это **типичным** юнит-тестом. 
Он тестирует код, но и только. Больше никаких преимуществ у него нет. Он не объясняет, почему именно такие значения. 
Почему "12345678" - корректное значение? Почему "1234567" - некорректное? Кто сказал?  
Именно после такого кода скептики делают вывод, что от юнит-тестов нет особой пользы.

### Попытка номер №2: хороший тест

В какой-то момент пришёл разработчик и решил применить к этому коду некоторые "best practices" из TDD: 
разбить тест-метод на несколько маленьких, так чтобы каждый из них тестировал только одну вещь, и дать им соответствующие имена.

Вот что у него получилось:

```java
public class ReferenceNumberTest {  
  @Test  
  public void testTooLong() {  
    String len13 = "1234567891111";  
    assertEquals(len13.length(), 13);  
    assertEquals(ReferenceNumber.validate(len13), false);  
  }  
  
  @Test  
  public void testTooShort() {  
    String len7 = "1234567";  
    assertEquals(len7.length(), 7);  
    assertEquals(ReferenceNumber.validate(len7), false);  
  }  
  
  @Test  
  public void testOk() {  
    String len8 = "12345678";  
    assertEquals(len8.length(), 8);  
    assertEquals(ReferenceNumber.validate(len8), true);  
  
    String len12 = "123456789111";  
    assertEquals(len12.length(), 12);  
    assertEquals(ReferenceNumber.validate(len12), true);  
  }  
}
```

Мы называем это **хорошим** юнит-тестом. 
Он гораздо легче читается: по названиям переменных легко догадаться, что 13 символов — это слишком много, 7 — слишком мало, а 8 символов — это нормально.

### Попытка номер №3: спецификация

Спустя какое-то время приходит ещё один разработчик и замечает, что даже этот хороший юнит-тест не является вполне читабельным и 
не предоставляет достаточно информации о том, как работает класс ReferenceNumber. 
Его можно понять, но для этого всё-таки надо залезть в код и немножко подумать. 

Разработчик продолжает процесс разбивки и переименования:

```java
public class ReferenceNumberTest {  
  @Test  
  public void nullIsNotValidReferenceNumber() {  
    assertFalse(ReferenceNumber.validate(null));  
  }  
  
  @Test  
  public void referenceNumberShouldBeShorterThan13() {  
    assertFalse(ReferenceNumber.validate("1234567890123"));  
  }  
  
  @Test  
  public void referenceNumberShouldBeLongerThan7() {  
    assertFalse(ReferenceNumber.validate("1234567"));  
  }  
  
  @Test  
  public void referenceNumberShouldContainOnlyNumbers() {  
    assertFalse(ReferenceNumber.validate("1234567ab"));  
    assertFalse(ReferenceNumber.validate("abcdefghi"));  
    assertFalse(ReferenceNumber.validate("---------"));  
    assertFalse(ReferenceNumber.validate("         "));  
  }  
  
  @Test  
  public void validReferenceNumberExamples() {  
    assertTrue(ReferenceNumber.validate("12345678"));  
    assertTrue(ReferenceNumber.validate("123456789"));  
    assertTrue(ReferenceNumber.validate("1234567890"));  
    assertTrue(ReferenceNumber.validate("12345678901"));  
    assertTrue(ReferenceNumber.validate("123456789012"));  
  }  
}
```

Мы называем это **спецификацией** в стиле BDD. 

Названия методов говорят почти на человеческом языке о том, как должен работать код. 
Мысленно вставив перед заглавными буквами пробелы, мы получаем спецификацию кода на английском языке. 
Чтобы понять, как работает класс, мы не должны залезать в код — достаточно прочитать называния. 
А если в ходе изменения кода в него внесли ошибку, и юнит-тест сломался, мы по названию сломавшегося тест-метода наверняка 
сможем определить, что за ошибка допущена в коде. 

> Между прочим, с этим примером произошла интересная история.
> Однажды я собирался показать этот пример эволюции юнит-теста на семинаре devclub.eu по BDD в Таллине. 
> И вот, за день до семинара я обнаружил, что я забыл скопировать исходный код самого класса ReferenceNumber, который 
> мы тут всю дорогу тестируем. Что делать? Паника! До семинара остался один день! Мне нужно было срочно самому написать его заново. 
>
> А теперь посмотрите на эти три тест-класса и подумайте, какой из них помог мне восстановить логику класса ReferenceNumber. 

### И наконец, BDD

Можно сказать, третья версия отличается от предыдущих тем, что она описывает поведение класса. 
Это достигается за счёт использования таких слов как «should» и «contain»: «мой класс должен вести себя так-то и так-то», «мой метод должен делать то-то и то-то».

Так вот, идея BDD как раз и заключается в том, чтобы вместо слов «test» и «assert» использовать слова «spec» и «should». 
Да-да, разница всего лишь в словах, но именно это, по замыслу авторов BDD, и делает спецификации удобочитаемыми, а 
написание тестов спецификаций до кода — естественным для человеческого мозга.

Убедиться в этом вы можете, взглянув на тот же пример, переведённый с языка [JUnit](http://junit.org/) на язык [Easyb](http://easyb.org/):

```groovy
description "ReferenceNumber"

it "should not be null", {
  ReferenceNumber.validate(null).shouldBe false
}

it "should be shorter than 13", {
  ReferenceNumber.validate("1234567890123").shouldBe false
}

it "should be longer than 7", {
  ReferenceNumber.validate("1234567").shouldBe false
}

it "should contain only numbers", {
  ReferenceNumber.validate("1234567ab").shouldBe false
  ReferenceNumber.validate("abcdefghi").shouldBe false
  ReferenceNumber.validate("---------").shouldBe false
  ReferenceNumber.validate("         ").shouldBe false
}

it "valid reference number examples", {
  ReferenceNumber.validate("12345678").shouldBe true
  ReferenceNumber.validate("123456789").shouldBe true
  ReferenceNumber.validate("1234567890").shouldBe true
  ReferenceNumber.validate("12345678901").shouldBe true
  ReferenceNumber.validate("123456789012").shouldBe true
}
```

Отчёт о запуске этих тестов спецификаций фактически может служить документацией:

![EasyB report](/public/img/easyb-report.png)

> Кроме it и should, в BDD есть и другие важные слова, такие как given, when и then, а также before и after, 
> ну и вдобавок ensure, narrative и «should behave as». 
> Также BDD подходит не только для юнит-тестов, но и для функциональных/интеграционных тестов, но это уже выходит 
> за рамки данной статьи. Сейчас нас интересует уровень юнит-тестов. 
> Цель данной статьи — показать, что их можно писать по-разному.

Осталось добавить, что библиотеки для написания BDD спецификаций есть и для других языков: Java 
([JDave](http://jdave.org/examples.html), [JBehave](http://jbehave.org/reference/latest/getting-started.html)),
Ruby ([RSpec](http://rspec.info/), [RBehave](http://blog.dannorth.net/2007/06/17/introducing-rbehave/), 
[Cucumber](http://cukes.info/)), Groovy ([Easyb](http://easyb.org/)), Scala ([Scala-test](http://www.scalatest.org/)), 
PHP ([Behat](http://everzet.com/Behat/)), CPP ([CppSpec](http://www.laughingpanda.org/projects/cppspec/example.html)),
.Net ([SpecFlow](http://specflow.org/), [Shouldly](https://github.com/robconery/shouldly)), 
Python ([Lettuce](http://lettuce.it/), [Cucumber](https://github.com/aslakhellesoy/cucumber/wiki/Python)).

А если по независящим от вас причинам вы не можете пересесть с JUnit на что-то другое — тоже ничего, только помните о третьем примере. 
Кстати, в этом случае вам пригодится библиотека [Harmcrest](https://code.google.com/p/hamcrest/wiki/Tutorial).

Как завещал Козьма Прутков: товарищ, BDDи!