---
layout: post
category: ru
title: Mockito научился мокать статические методы!
---

Горячие новости!

Mockito только что выпустил версию 3.4.0, в которой он умеет мокать статические методы. 

<!--more-->

Раньше Mockito этого не умел. Умел мокать только нестатические методы. Зато PowerMock умел. Но PowerMock делал это 
очень медленно, ведь для этого он подменял загрузчик классов (classloader), и весь тест запускал в нём. И перед 
каждым тестов инициализировал загрузчик классов заново. 

А вот новый способ от Mockito 3.4.0 должен быть значительно быстрее, потому что у него меньше скоп: он мокает 
статический метод только в рамках одной маленькой лямбды. Изящно. 
 
Давайте попробуем!

### Шаг 1: зависимость
В нашем `build.gradle` меняем `mockito-core:3.3.3` на `mockito-inline:3.4.0`:

```groovy
testImplementation('org.mockito:mockito-inline:3.4.0')
```

### Шаг 2: что мокаем
Предположим, у вас есть некий класс со статическим методом, который вы хотите замокать в тесте:

```java
class Buddy {
  static String name() {
    return "John";
  }
}
```

### Шаг 3: Мокаем статический метод

Для этого нужно использовать метод `Mockito.mockStatic()`:

```java
@Test
void lookMomICanMockStaticMethods() {
  assertThat(Buddy.name()).isEqualTo("John");

  try (MockedStatic<Buddy> theMock = Mockito.mockStatic(Buddy.class)) {
    theMock.when(Buddy::name).thenReturn("Rafael");
    assertThat(Buddy.name()).isEqualTo("Rafael");
  }

  assertThat(Buddy.name()).isEqualTo("John");
}
```

Всё. Mockito подменяет статический метод только в рамках try/catch блока. Быстро и эффективно (
Насколько это быстро, пока проверить не успел, извиняйте. :)
). 

Больше примеров вы можете найти [в тестах самого Mockito](https://github.com/mockito/mockito/blob/static-mock/subprojects/inline/src/test/java/org/mockitoinline/StaticMockTest.java).

<br/>

Отличная работа, [Rafael Winterhalter](https://twitter.com/rafaelcodes)!

NB! Не забывайте, что [статические методы - зло](https://www.youtube.com/watch?v=4JJNccWtdNI), и старайтесь их по возможности не использовать. 

 
[Андрей Солнцев](https://twitter.com/asolntsev) 

[asolntsev.github.io](https://asolntsev.github.io/ru)
