---
layout: post
category: en
title: WTF is business logic?
---

### Question

I have heard many times the term "logic" or "business-logic" in discussions about software development. For instance:

* (about unit-tests) it's not necessary to achieve 100% code coverage, testing of **logic** is god enough.
* (about web applications architecture) controller should not contain any **business logic**, it only should call other classes's methods.
* VIEW layer (e.g. JSP files) should not contain any **business logic**

Now tell me, what is "logic"? 

<!--more-->

Does it mean any IF in code? But, I don't think that code without IFs ever existed. 
Or "business-logic" means any information that came from client? 
Actually I believe that all what we do is initiated by client, so all our code does contain information from client. 
That's why I never could understand what the fuck is "business logic".

 
### Answer

Probably this question could be easier answered if you use term "knowledge" instead of "logic". "Logic" is any knowledge about the code, or about how your code should behave. It may be also expressed like "logic is anything that you ever wanted to comment".

### Example

Let's consider class Account for example.

Once upon a time Internet connection disappeared from our office for two hours. I actually could not work because SVN, jira, dabase etc. were not available. And I decided to exercise in writing unit-tests. So I found class Account:

```java
public class Account
{
  // Negative amount means that account is prepaid
  private BigDecimal amount;
  public BigDecimal getAmount() {
    return amount;
  }

  // And 20 getters/setters more
}
```

At the first glance, is there anything to test? Is there any IFs? Is there any logic? It seems that no. 
No logic, no IFs - nothing to test. 
I wanted to skip this class and find something more complicated, but eventually got sight of the comment near the `amount` field:

> Negative amount means that account is prepaid

Wait, what is that?

It turns out that the amount is a total debt of the client, and if the client has made an advanced payment, 
then this "debt" is negative. Well, this is some knowledge about the code. Let's try to 
[convert this comment to unit-test](http://asolntsev.blogspot.com.ee/2010/05/why-devil-invented-javadoc.html):

```java
public class AccountTest
{
  @Test
  public void negativeAmountMeansThatAccountIsPrepaid() {
    Account prepaidAccount = new Account(-123);
    assertTrue(prepaidAccount.isPrepaid());
  }
}
```

Since we check for negative amount, it also would be reasonable to check for positive amount:

```java
@Test
public void positiveAmountMeansThatAccountIsInDebt() {
  Account indebtAccount = new Account(456);
  assertFalse(indebtAccount.isPrepaid());
  assertTrue(indebtAccount.isInDebt());
}
```

We have eventually got two new methods isPrepaid and isInDebt, which implementation is of course straightforward for you:

```java
public class Account
{
  private BigDecimal amount;
  public boolean isInDebt() {
    return amount > 0;
  }
  public boolean isPrepaid() {
    return amount < 0;
  }
}
```

You see, we have got IF's in our code!
What's next? You should have thought: probably, these IF's already were somewhere in the code?

I had to search for such IF's for a while, but it was worth it. 
These IFs were in JSP files, which is the "view" layer, which should not contain any business logic by definition:

```jsp
<% Positive amount means that account is in debt %>
<c:if test="${account.amount > 0}">
  <span style="color: red;">Please pay your debt!</span>
</c:if>
<c:if test="${account.amount < 0}">
  <span style="color: green;">Advanced payment</span>
</c:if>
```

Wow, we have found the second test-case. Cool. Now, since we have methods isInDebt and isPrepaid, we can abandon logic in JSP:

```jsp
<c:if test="${account.inDebt}">
 <span style="color: red;">Please pay tour debt!</span>
</c:if>
<c:if test="${account.prepaid}">
  <span style="color: green;">Advanced payment</span>
</c:if>
```

Is it better? I believe it is. This is _encapsulation_ - hiding the implementation of logic from outer code. 
Class Amount is the only in the whole world who knows how to define, if client is in debt or has advanced payment. 
Other code doesn't ever know how it happens - it can get resulting boolean throught methods `isInDebt()` and `isPrepaid()`. 

Theoretically "in debt" and "advanced payment" information could be stored in different columns, or event different 
tables, or even different databases. Nobody knows. Thanks to two methods, this logic is encapsulated in class `Account`.

If you still don't believe, compare code size:

**Before**

```jsp
<%-- Positive amount means that account is in debt %-->
<c:if test="${account.amount > 0}">
  <span style="color: red;">Please pay your debt!</span>
</c:if>
```

**After**

```jsp
<c:if test="${account.inDebt}">
  <span style="color: red;">Please pay your debt!</span>
</c:if>
```

You can go further and create two different methods `getPrepaidAmount()` and `getDebt()` instead of method 
`getAmount()`. Additionally they can check, if the client has really debt or advanced payment. 
As a result, it's impossible now to write a code like this one:

```jsp
<%-- No matter if you have advanced payment, 
I still think that you are in debt! %>
<c:if test="${account.amount != 0}">
  <font color="red">Please pay your debt!</font>
</c:if>
```

Yeah, it's a real code snippet. 
Look at this once more. "No matter if you have". Pretty cool! That is WTF logic!
It's not possible to get to know what those people though - people who did not write unit-tests. 

Ideally, method `getAmount()` should be removed. 
This would be the real encapsulation: hiding of data and code and making them available only throught API. 
I think I would remove all of 20 other getters/setters if internet connection wouldn't get back to our office that day.

### Moral

As You see, unit-tests lead you to readable, object-oriented code. 

Are you still thinking that your code doesn't contain logic? Are you still thinking that you code has nothing to test? 

Of course it has!