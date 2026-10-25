---
layout: post
category: en
title: Why IFs in tests are evil
---

I often say that IFs in tests are evil.

People often ask me why. Here is my answer.

<!--more-->

A test is a specification. A test checks that the program works the way it should. 
Which means the test knows exactly how it should work. A good test should look like this:

* This thingy must be green
* And that whatchamacallit must be red

If this thingy is not green, the test must fail. If that whatchamacallit is not red, the test must fail. 
Period. There is no place for conditions here. 

## A bit more formally

Let me be more specific. This kind of IF is allowed in tests:

> IF (something) STOP EXECUTION

Moreover, that's what tests are made of. And there are two ways to stop: mark the test red (assert) or yellow (assume).
But the important thing is that the test checked one thing and finished. 

But this kind of IF is strictly forbidden:

> IF (something) do something (case A)

or:

> IF (something) do one thing (case A)
> ELSE do another thing (case B)

This is bad for many reasons, first of all:
1. Case A might never get tested
2. Case B might never get tested

The right solution is to write two different tests: one for case A, another for case B. 

## A typical bad IF

My favourite example is the notorious banner. You are testing a web application where an advertising banner can pop up at any moment, and then you have to close it. 
So you have to add a condition like this to your test:

> IF (banner is open) THEN close the banner

Such an IF is a terrible evil for many reasons.
1. It slows the test down a lot (my favourite question: "How do I wait for an element to appear, but if it doesn't appear, not fail and just continue the test?")
2. It makes the test much more complex
3. It doesn't solve the problem anyway (because the banner can appear a split second AFTER you've done your check) 
4. If the banner never appears during this test run, the banner case stays untested. 
 
The only right solution in this situation is to take control of the test environment. What you actually need is two different tests:
#### Test 1
* Arrange: Tell the test environment: "Don't show the banner to this customer".
* Act: Log in as this customer
* Assert: Check case A: working without the banner.

#### Test 2
* Arrange: Tell the test environment: "Show the banner to this customer on this page".
* Act: Log in as this customer
* Assert: Check case B: working with the banner. Check that the banner opened at the right moment, close the banner, check everything else.

To do this, you need to be able to control the test environment. For many people this turns out to be an insurmountable obstacle. They give up and 
start their usual song and dance: "we have special circumstances", "you can't always do everything perfectly" etc.

Guys, just be honest with yourselves: you are doing nonsense.  
Instead of solving the real problem, you put IFs into tests and look for excuses.
It doesn't solve the problem anyway, but it creates the illusion that you have everything under control. 
You are behaving unprofessionally. You were hired to find problems, but you know about problems and turn a blind eye to them. 


## What are the usual arguments for IF?

People often say that IF is needed:

* during test setup. For example,
> IF (browser is not opened yet) THEN open browser

Such an IF is acceptable because it **doesn't change the logical flow of the test**, it only **optimizes speed**. 
Here is the litmus test: you can get rid of this IF by closing and opening the browser every time. Nothing but speed will suffer, the test will work exactly the same.  



* when tests run in different configurations.
For example, IF (configuration is X) THEN <work with the page this way> ELSE <work with the page that way>

This is exactly the forbidden IF. A test must know exactly which configuration it runs in and what it checks.
If the application behaves differently in different configurations, these are different test cases, and they need different tests.
And if the test can't determine which configuration the application runs in, and starts guessing by the visibility of elements,
it's a sure sign that the test environment is out of control.

Sometimes people object: "OK, but my final check has no IFs!" 
That doesn't help. If the path to the final check depends on a condition, you still don't know which path was tested this time.

* when tests run in production.
Someone once told me this story: tests ran right in production, with real airline ticket bookings.
Testing in a test or staging environment was impossible because the environment didn't match production.
The business operates in 40 countries, flight rules change all the time, and the relevant part of the system has to be changed
right in production, without testing on pre-production, otherwise there are huge fines. And in production, obviously, you don't control anything,
so you end up putting IFs everywhere.

None of this is good at all. These are symptoms of deeper problems:

1. There is an obvious lack of unit tests. It's impossible to cover the whole variety of cases happening in 40 countries with UI tests. 
That's why bugs keep popping up in production.
2. An acute lack of automated deployment and a decent test environment. That's why changes have to go straight to production.

These problems must be solved, instead of putting IFs into tests.

## But it's like bandaging a wound!

My interlocutor came up with a good analogy back then. An IF in a test is like bandaging a wound. 
If you don't bandage it now, the patient will lose a leg, or worse. First you give first aid, 
and only then you take the patient to the hospital for proper treatment.

Well, yes, you can see it that way. But you can't stop at bandaging, right? 

It would be silly to brag: look how cool we are at bandaging wounds, we don't need any surgery!
And to give talks about it at conferences.

## Summary

Every IF in a test is a signal that you don't control something: test data, the test environment, the application configuration.
Don't hide this signal behind a condition. Find out what exactly you don't control, take it under control, and write two honest tests instead of one tricky one.

[Andrei Solntsev](https://twitter.com/asolntsev) 

[asolntsev.github.io](https://asolntsev.github.io/en)
