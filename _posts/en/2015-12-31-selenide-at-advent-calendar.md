---
layout: post
category: en
title: Effective UI tests with Selenide
---

### Waiting for miracles

Christmas is a time for miracles. On the eve of the new year we all build plans for the next. 
And we hope that all problems will leave in the ending year, and a miracle happens in the coming year.

Every Java developer dreams about a miracle that lets him become The Most Effective Java Developer in the world.

I want to show you such a miracle.

It's called _automated tests_!

### Ugh, tests?

Yes. 
You will not become a real master thanks to micro/pico/nano services. You will become a real master thanks to discipline.
Discipline claiming that developer only then reports jobs as _done_ when code **and tests** are written and run.

### But, isn't testing boring?

Oh no, believe me! Writing of **fast** and **stable** automated tests is a great challenge for smartest heads. 
And it can be very fun and interesting. You only need to use right tools.

The right tool for writing UI tests is:

## Selenide

Selenide is an open-source library for writing concise and stable UI tests.

Selenide is an ideal choice for software developers because it has a very low learning curve. Thus, you don't need to
bother with browser details, all these typical ajax and time issues that eat most of QA automation engineers' time.

Let's look at a simplest Selenide test:

```java
public class GoogleTest {
  @Test
  public void user_can_search_everything_in_google() {
    open("http://google.com/ncr");
    $(By.name("q")).val("selenide").pressEnter();

    $$("#ires .g").shouldHave(size(10));

    $("#ires .g").shouldBe(visible).shouldHave(
        text("Selenide: concise UI tests in Java"),
        text("selenide.org"));
  }
}
```

(Of course, you will test your web application instead of Google).

Let's look closer what happens here. 

* You **open a browser** with just one command `open(url)`
* You **find an element** on a page with command `$`.<br/>You can find element by name, ID, CSS selector, attributes, xpath and even by text.
* You **manipulate the element**: enter some text with `val()` and press enter with (surprise-surprise!) `pressEnter()`.
* You **check the results**: find all found results with `$$` (it returns a collection of all matched elements).
You check the size and content of the collection.

Isn't this test easy to read?<br/>
Isn't this test easy to write?

I believe it is.

And it's easy to **run**, look at this:

<center>
<iframe src="https://player.vimeo.com/video/73128965" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/73128965">Selenide Harlem Shake</a> from <a href="https://vimeo.com/user20427140">Selenide</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
</center>


## Deeper into details

Of course, real life is never that simple.
Writing autotests means a lot of problems, that's why developers are afraid of tests more than of any complex framework or technology. 

The good news is that Selenide resolves most of these problems.

Let's consider typical problems of UI-tests.

### Ajax/timing problems

Nowdays web applications are dynamic. Every single piece of application can be rendered/changed dynamically at any moment. 
This creates a lot of problems for automated tests. Test that is green today can suddenly become red at any moment,
just because browser executed some javascript a little bit longer than usual. 

It's a real _pain in the ajjaxx_.

Quite unbelievably, but Selenide resolves most of the these problems in a very simple way.
 
Simply said, every **Selenide method waits** a little bit _if needed_. People call it "smart waiting".

When you write

```java
$("#menu").shouldHave(text("Hello"));
```

Selenide checks if the element exists and contains text "Hello". 

If not yet, Selenide assumes that probably the element will be updated dynamically soon, and waits a little bit until it happens. 
The default timeout is 4 seconds, which is typically enough for most web applications. 
And of course, it's configurable.

### Doesn't it make my tests slow?

No, it doesn't. Selenide waits only when it's needed.
If element is already visible on the page - Selenide will not wait. 
If element appears after 300 ms - Selenide will only wait for 300 ms.
That's perfectly what you need.

### Rich set of matchers

You can check pretty much everything with Selenide. Using "smart waiting" mechanism mentioned above.

For example, you can check if element exists. If not yet, Selenide will wait **up to** 4 seconds.

```java
$(".loading_progress").shouldBe(visible);
```

You can even check that element **does not** exist. If it still exists, Selenide will wait up to 4 seconds until it disappears. 

```java
$(By.name("gender")).should(disappear);
```

And you can use fluent API and chain methods to make your tests really concise:

```java
$("#menu")
  .shouldHave(text("Hello"), text("John!"))
  .shouldBe(enabled, selected);
```

### Collections

Selenide allows you to work with collections, thus checking a lot of elements with one line of code.

For example, you can check that there are exactly N elements on a page:

```java
$$(".error").shouldHave(size(3));
```

You can find subset of collections:

```java
$$("#employees tbody tr")
  .filter(visible)
  .shouldHave(size(4));
```

You can check texts of elements. In most cases, it's sufficient to check the whole table or table row:

```java
$$("#employees tbody tr").shouldHave(
  texts(
      "John Belushi",
      "Bruce Willis",
      "John Malkovich"
  )
);
```

### Upload/download files

It's pretty easy to upload a file with Selenide:

```java
$("#cv").uploadFile(new File("cv.doc"));
```

You can even upload multiple files at once:

```java
$("#cv").uploadFile(
  new File("cv1.doc"),
  new File("cv2.doc"),
  new File("cv3.doc")
);
```

And it's unbelievably simple to download a file:

```java
File pdf = $(".btn#cv").download();
```

### Testing "highly dynamic" web applications

Some web frameworks (e.g. GWT) generate HTML that is absolutely unreadable. Elements do not have constant IDs or names.

It's a real _pain in the xpathh_.
 
Selenide suggests to resolve this problem by searching elements by text.
 
```java
import static com.codeborne.selenide.Selectors.*;

$(byText("Hello, Kitty!"))             // find by the whole text
   .shouldBe(visible);

$(withText("itt"))                     // find by substring
   .shouldHave(text("Hello, Kitty!"));
```

Searching by text is not bad idea at all. In fact, I like it because it emulates behaviour of real user. 
Real user doesn't find buttons by ID or XPATH - he finds by text (or, well, color).

Another useful set of Selenide methods allows you to navigate between parents and children.

```java
$("td").parent()
$("td").closest("tr")
$(".btn").closest(".modal")
$("div").find(By.name("q"))
```

For example, you can find a table cell by text, then by its closest `tr` descendant and find a "Save" button inside this table row:

```java
$("table#employees")
  .find(byText("Joshua"))
  .closest("tr.employee")
  .find(byValue("Save"))
  .click();
```

### ... And many other functions

Selenide has many more functions, like:

```java
$("div").scrollTo();
$("div").innerText();
$("div").innerHtml();
$("div").exists();
$("select").isImage();
$("select").getSelectedText();
$("select").getSelectedValue();
$("div").doubleClick();
$("div").contextClick();
$("div").hover();
$("div").dragAndDrop()
zoom(2.5);
...

```

but the good news is that you don't need to remember all this stuff. 
Just put $, put dot and choose from available options suggested by your IDE.

Use the power of IDE! Concentrate on business logic.

![Power of IDE](http://selenide.org/images/ide-just-start-typing.png)


# Make the world better
I believe the World will get better when all developers start writing automated tests for their code. 
When developers will get up at 17:00 and go to their children without fearing that they broke something with last changes.   

Let's make the world better by writing automated tests!

>> Deliver working software.

[Andrei Solntsev](https://twitter.com/asolntsev) 

[selenide.org](http://selenide.org)
