---
layout: post
category: en
title: Mockito can mock static methods!
---

Hot news!

Mockito just released version 3.4.0 which can now mock static methods. 

<!--more-->

Before 3.4.0, Mockito could not mock static methods. It could only mock non-static methods. 
Though, PowerMock could. But PowerMock did it slowly: it replaced a classloader for every test, and executed the 
whole test within this classloader. 

And the new Mockito 3.4.0 way should be more effective because it has narrower scope: it mock the static method 
only within one small lambda. Graceful.  
 
Let's try it!

### Step 1: dependency
In your `build.gradle` replace `mockito-core:3.3.3` by `mockito-inline:3.4.0`:

```groovy
testImplementation('org.mockito:mockito-inline:3.4.0')
```

### Step 2: what are we going to mock

Let's assume we have a class with static method (that we want to mock in test):

```java
class Buddy {
  static String name() {
    return "John";
  }
}
```

### Step 3: Mock the static method

We can use new method `Mockito.mockStatic()` for this:

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

That's it.  
Mockito replaces the static method only with the try/catch block. Fast and simple (I haven't checked how fast is it actually, sorry. :)
)   

You can see more example [in Mockito own tests](https://github.com/mockito/mockito/blob/static-mock/subprojects/inline/src/test/java/org/mockitoinline/StaticMockTest.java).

<br/>

Great job, [Rafael Winterhalter](https://twitter.com/rafaelcodes)!

NB! Don't forget [static methods are evil](https://www.youtube.com/watch?v=dFQSOlOOoXE&list=PLfazdZ9SzB9eDJIugtfH7KeVLLAP1pDLh). 
Try to avoid them if possible. 
 
[Andrei Solntsev](https://twitter.com/asolntsev) 

[asolntsev.github.io](https://asolntsev.github.io/en)
