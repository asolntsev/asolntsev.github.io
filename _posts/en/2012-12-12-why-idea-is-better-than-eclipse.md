---
layout: post
category: en
title: Why IDEA is better than Eclipse
---

### Holy war

There are "eternal" questions that have no single correct answer. E.g. what is better: Windows or Linux, Java or C#; who is stronger, Chuck Norris or Van Damme.
One of such holywars is selection of the best Java IDE:
 
![Eclipse vs IDEA](/public/img/eclipse_vs_idea_eng.png)

There is a lot of disputes on this topic discussing which of them has more plugins, shortcuts and so on. 
There is so many differences that it's difficult to decide what of them are the most important. 
As a result, people typically claim that both IDEs are equal in their capabilities, and choosing of one of them is a matter of taste.

I claim that it is not just a matter of taste. There are objective reasons why
>> [Intellij IDEA](http://www.jetbrains.com/idea/) (as a Java IDE) is definitely better than [Eclipse](http://www.eclipse.org/).
 
I am not going to compare lot of tiny differences like plugins, shortcuts etc - there is a plenty of blog posts on 
this topic, like this one: [part 1](http://arhipov.blogspot.com/2011/06/whats-cool-in-intellijidea-part-i.html), 
[part 2](http://arhipov.blogspot.com/2011/07/whats-cool-in-intellijidea-part-ii-live.html),  
[part 3](http://arhipov.blogspot.com/2011/08/whats-cool-in-intellijidea-part-iii.html).
I am going to show just one major difference between IDEA and Eclipse. 
Typically, neither IDEA nor Eclipse fans know it. 
The first ones used to it and cannot imagine that IDE can miss it. 
The second ones used to live without it and cannot imagine that IDE can do such things. 
Moreover, Eclipse users typically don't notice this difference when trying IDEA for fun, just because they used to work "in Eclipse mode".

### Why am i so confident?

Before I start, let me explain who I am and why is my opinion worth listening to.

I've been working on Eclipse for 5 years, I knew it very well, I wrote plugins for it and sincerely loved Eclipse.
Then I switched to another company, and was forced to move to IDEA. 
After surviving a serious break-up, I finally realized why is IDEA steeper. 
And now I have been working on IDEA for a couple of years. So I know both IDEs well and can compare them.

<br>

## The main difference between idea and eclipse

The main reason why IDEA is steeper is: IDEA **feels context**. 
That's what JetBrains employees mean when they name IDEA intelligent. 
What it really means? IDEA indexes the whole your project, analyses everything it has, and even builds the syntax tree. 
Thanks to it, at any time, wherever you put the cursor, IDEA knows where you are and what can be done there.

Still not clear? Do not worry, it will become clear in the following examples.

This ability _to understand the context_ is expressed in many, many ways, here are just a few.

#### 1. Debugging
As a part of debugging process, we often want to evaluate some expression to see its value. In Eclipse you need to select this expression. It's important to exactly select the whole expression, otherwise Eclipse cannot evaluate it. Now you press Ctrl+Shift+I and see the value of expression.

![eclipse_inspect.png](/public/img/eclipse_inspect.png)

With IDEA you don't need to select anything. 
You just put cursor at any place inside your expression (at method hasAttribute in given case) and press Alt+F8. 
IDEA understands which expression you probably need and shows a dialog window suggesting several possible variants 
for your expression. You can also edit and immediatelly evaluate the expression in this dialog. 
Very convenient! After trying this feature, you just cannot debug in Eclipse anymore. 

![idea_inspect.png](/public/img/idea_inspect.png)

It turns out that both IDEs, in principle, allow you to do the same thing. But with IDEA it's much easier and faster. I'm serious, the difference is huge - it's just Heaven and Earth. In this small dialog window IDEA will provide autofilling, syntax highlighting and everything you need.

#### 2. Autocomplete
Autocomplete is what distinguishes any IDE from the notepad. In this area _feeling_ the context gives IDEA a qualitative advantage. For example, we started writing a line of code:

```java
assertElement(By.id("errorMessage"), vi
```

and now we want to find what options do we have: what can start with letters "vi".

What IDEA does? Not waiting for any keystrokes, it immediately understands that method assertElement wants an Condition class instance as a second parameter, and there is a static variable in class Condition with name visible. 
And IDEA immediately suggests the only valid option:
![idea_autocomplete.png](/public/img/idea_autocomplete.png)

And what Eclipse does? Alas, it does not understand the context. 
It does not know that the cursor is located where the second parameter of the method assertElement should place. 
So when you press the sacred Ctrl + Space, Eclipse simply shows everything in Universe that begins with the letters "vi":

![eclipse_autocomplete.png](/public/img/eclipse_autocomplete.png)

In a beautiful pop-up window we see a lot of pretty-highlighted well-documented useless information. :(

#### 3. Refactoring

Professional programmers are able to be productive using refactorings provided by their IDE. 
All modern IDE offer a very impressive set of refactorings. But then again, IDEA refactorings are _intelligent_.
They realize what you want, and offer different options that are suitable for most situations.

For example, suppose we have a method `assertErrorMessageIsHidden`:

```java
public void assertErrorMessageIsHidden() {
    assertElement(By.id("errorMessage"), Condition.visible);
  }
```
  
And we want the String `"errorMessage"` to come as a parameter to this method. 

Let's start from IDEA. Put the cursor to any place inside the string "errorMessage", press Ctrl+Alt+P 
(meaning "parameter"), and IDEA suggests what expression we probably could extract to a parameter:

![idea_refactoring.png](/public/img/idea_refactoring.png)

As soon as the expression "errorMessage" is selected, IDEA suggests several possible names for this parameter.

![idea_name_parameter.png](/public/img/idea_name_parameter.png)

#### Wow every month

You will be surprised many, many times at how smart behaves IDEA, offering options for the name of something. 
It takes into account method name, variable type and even value, and names of such variables in other places, and 
those names that you gave such a variable before - except that your zodiac sign is ignored. 
Believe me, you will say: "Wow, IDEA is able to do such thing too?" at least once every month.

And now let's look that Eclipse suggests. 

Do not forget: select the entire expression "errorMessage" (always with quotes, or get a wild message 
"An expression must be select to activate this refactoring"), choose a refactoring "Introduce parameter" 
(from the menu, there is no hot key) and get about the same result. However, Eclipse doesn't suggest options for a 
parameter name, but thanks for that.

![eclipse_refactoring.png](/public/img/eclipse_refactoring.png)

## Conclusion

If we are choosing a Java IDE then Intellij IDEA is definitely better than Eclipse. 
It's not just a matter of taste. IDEA is objectively better. 
It lets you to quickly and easily write and change the code, suggests appropriate names, finds the appropriate methods. 
It does not require you to exactly select the expressions, but guesses what you want to do and how you wanted to name it. 
IDEA anticipates and suggests.

### P.S. Remarks

I claim that IDEA is better Eclipse just as a Java IDE. If you are considering them in some other capacity - such as 
the IDE for other languages ​​(C++, Python, Scala), or as a platform for building desktop application, Eclipse may very well win.

Actually it follows from their definition. 
Eclipse has positioned itself as an abstract platform for building anything with plug-ins, and IDEA is positioning 
itself as a "intelligent IDE for Java". So it is.

For the sake of interest I will try to name some aspects in which the Eclipse is probably better than IDEA:

* Eclipse looks better (thought, this is a matter of taste). All this fuss about SWT and native controls was worth it. Eclipse looks like a solid well thought-out application with pretty fonts and icons, while the IDEA at first glance looks like a stunt toy with a lame hack icons and awkward Swing interface.
* Eclipse has a richer project structure support. In IDEA you have a project consisting of modules. In Eclipse you have a workspace consisting of projects which can be closed/opened, grouped and hidden. But do you actually need it?
* It seems to be easier to write plugins for Eclipse.
* IDEA uses more resources (memory) than Eclipse. This actually makes sense - because he knows so much.
* And finally, Eclipse is free. However, IDEA [Community Edition](http://www.jetbrains.com/idea/features/editions_comparison_matrix.html?IC) is just enough for me.

### My final recommendation

If you need pretty icons, platform for creating desktop applications, IDE for C++, or you work on an old weak laptop, 
then Eclipse is problably better choice for you. But if you are a serious Java developer, and you need a fast and 
convenient tool that helps you focus on the problem instead of distracting, then the IDEA this is exactly what you need. 

I hope one more holywar is over today.

Develop with pleasure!