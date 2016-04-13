---
layout: post
category: en
title: How Java8 can help in writing unit-tests
---

### Problem

Typically you need to create a lot of various objects with various states in your tests. 
But you don't always have appropriate constructors, and probably don't want to have too many constructors. 

And Java 8 can help here!

<!--more-->

### How you solve it now

Let's suppose that you have a class `Employee`:

```java
public class Employee {
  public String firstName;
  public String lastName;
  public Date birthDate;
  public String birthPlace;
  public Gender gender;
}
```


In some tests you want to set only name, in others - only birthday, 
sometimes only gender. In most tests, you want to set different combinations of data.

How to create so much different objects in tests?

Typically we have four options, all of which are not very good.

#### Option 1: lot of constructors

You create a lot of constructors for different data sets.

```java
public Employee(String lastName) {
  this(null, lastName, null, null, null);
}

public Employee(Date birthDay, String birthPlace) {
  this(null, null, birthDay, birthPlace, null);
}
```
etc.

It's obvious why this is not a very good solution: too many constructors. 
You probably don't want to have too many constructors, especially if you only use them in tests.

#### Option 2: lot of `null`s

The next option is to have one "common" constructor with all possible parameters.
In this case your tests soon become to a mass of comma-separated "nulls":

```java
@Test public void test1() {
  new Employee(null, "Smith", null, null, null);
}

@Test public void test2() {
  new Employee(null, new Date(11, 11, 2011), "Happiness", null);
}
```

Again, it's obviously not very good. What's exactly "Happiness" - what field is it?
Is it family name? First name? Previous employer? Job expectations?
You need to dive into the constructor to understand. IDE helps somewhat, but...

This solution has one more problem. 
When you add new field to this class, you will need to refactor many-many existing tests.
IDE helps somewhat, but still... 

#### Option 3: lot of helper methods

You can also create plenty of helper factory methods for creating objects:

```java
public void GenderTest {
  private static Employee withBirthdate(Date birthDate, String birthPlace) {...}
  private static Employee withGender(Gender gender) {...}
}
```

It's not a bad option. 
But you still need to write a lot of assistance code, and such methods are often duplicated among tests.

#### Option 4: the desolation of builders

We all love patterns. We all love builders. It's recommended quite often.
 
```java
  @Test public void test1() {
    Employee employee = Employee.builder()
      .withFirstName("john")
      .withLastName("Smith")
      .withGender(MALE)
      .build();
  }
```

It look pretty good.

But isn't it too much helper code just for tests?
Yes, you need to write quite a lot of code for builder pattern.

There probably are some libraries that can generate builders. That's good.
But we have simpler option: Java 8 suggests a solution out-of-the-box.

### So how Java 8 will solve this?

Java 8 brings lambdas. Nobody knew why it's cool, but everybody thought that it's cool.
Now it's time for lambdas! Now we will see why they can be useful.

Look how you can create objects in tests - using lambdas:

```java
  @Test public void test1() {
    Employee employee = new Employee(e -> e.lastName = "Smith");
  }

  @Test public void test2() {
    Employee employee = new Employee(e -> {
      e.birthDate = dateX; 
      e.birthPlace = "PlaceX";
    });
  }
```

Such tests are pretty well readable. You see what fields are initialized. 
You don't need to dive into constructor.

You don't need to write lot of constructors, builders or any other assistance code.
You just need the only constructor:

```java
public Employee(Consumer<Employee> builder) {
  builder.accept(this);
}
```

That's it!
You get pretty readable tests with almost zero investment.

Future is already here.


[Andrei Solntsev](https://asolntsev.github.io) 

[selenide.org](http://selenide.org)



