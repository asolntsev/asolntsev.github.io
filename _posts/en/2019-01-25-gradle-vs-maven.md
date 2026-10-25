---
layout: post
category: en
title: Gradle vs Maven
---

The eternal holy war: "Maven is better than Gradle".

Let me share my arguments for why I personally prefer Gradle. I've been using it since 2011 in Selenide, RePlay and most of my work projects.

Most often I hear arguments for Maven like these:
* Maven is tailored for a standard project structure, and most projects are standard anyway
* Maven's XML gives you autocompletion
* Who cares that Maven downloads the whole internet - the internet is fast and cheap nowadays

Let's figure it out.

<!--more-->


## Argument 1: "All projects are the same"

The main wrong assumption many people make sounds something like this:

> 99.95% of Java projects on this planet are bloody enterprise, producing a standard JAR/WAR/EAR.

The idea being that if all projects are standard, nobody needs a flexible build. Just take Maven with its conventions and be happy.

In my experience, it's exactly the opposite. 99.95% of projects on the planet - both enterprise and open-source - are different.
I don't remember a single project where the standard Maven (or Gradle) structure worked "out of the box".
Every project customizes at least something.

Take [Selenide](https://github.com/selenide/selenide), for example. It seems to be a simple open-source project without any bells and whistles.
And yet its `build.gradle` has already grown to 256 lines.

So the right question is not "do we need to customize the build?", but "where is it easier to customize the build?".
And here Maven definitely loses.

## Argument 2: Customization

In Maven, to do anything non-standard, you have to write your own plugin. And a plugin is a separate project, with its own separate build script, which you need to build, publish, plug in...

Just think about it: a build script for a plugin for a build script!

In Gradle you don't need any of this. A couple of lines of Groovy right in the same `build.gradle` - and you're done.

Yes, in Groovy it's very easy to put a couple of curly braces in the wrong place, and honestly, that drives me crazy.
But it's still the lesser of two evils.

## Argument 3: "XML gives you autocompletion"

That's total nonsense!
Yes, XML is indeed simpler in form. Meaning the IDE can close an XML tag or a quote for you. And that's it.
But it's exactly inside those tags that all the complexity hides: which plugins to declare, in what order, with what parameters...
With all of that, **XML doesn't help anymore**.

And what if you want to run some action after another one? No way. In Maven, behind the seeming simplicity of XML hides a complex system of lifecycles, profiles, etc. -
which is hard to understand and almost impossible to debug.

And on top of that, your team has a "craftsman" who wrote a Maven plugin (since that's the only way to customize the build)... Good luck figuring it out!

In Gradle, on the other hand, you can simply say in one line: "Run this action before the tests". That's it. Simple and clear.

## Argument 4: "The internet is cheap"

Another popular argument: the fact that Maven downloads half of the internet is not a problem, since traffic is cheap nowadays.

Yes, the internet is indeed cheap. But the point is not the amount of downloaded data.
The point is that Maven obviously downloads too much and takes too long. You can see it with the naked eye.

A simple example: the `mvn help:help` command downloads 6 MB of dependencies.
Just to show its own help!

## Bonus: ask for help

By the way, the `mvn help:help` command itself is a great demonstration of how weird Maven is.
Why not just `mvn help`?
How on earth should I guess that I need to _ask for help twice, separated by a colon_? :) What is this, Morse code of the 21st century?

Just look at what a clear message Maven gives you when you simply ask it for help:

```
> mvn help
[ERROR] Unknown lifecycle phase "help". You must specify a valid lifecycle phase or a goal 
in the format <plugin-prefix>:<goal> or <plugin-group-id>:<plugin-artifact-id>[:<plugin-version>]:<goal>. 
```

And just for comparison, here is Gradle:

```
> gradle help
:help

Welcome to Gradle 2.13.

To run a build, run gradle <task> ...

To see a list of available tasks, run gradle tasks

To see a list of command-line options, run gradle --help
```

The difference is like between a Trabant and an Audi.

## A fly in the ointment
Gradle build scripts are written in Groovy. It's easy to make a syntax error. Easy to stick a quote in the wrong place.
You never know whether it's `version: "1.2.3"` or `version = "1.2.3"`. Or even `version "1.2.3"`.

That drives me crazy about Gradle too. You could say I'm not completely happy with either tool.

But of the two evils, Gradle is still the lesser one.


## Summary

* There is no such thing as a standard project. Sooner or later, every build needs customization.
* In Gradle, customization is a couple of lines in the same file. In Maven, it's a separate plugin, a separate project.
* Maven downloads too much and takes too long. And it's not about the cost of traffic, it's about time.
* And yes, Gradle can be annoying in some ways too.


[Andrei Solntsev](https://twitter.com/asolntsev) 

[asolntsev.github.io](https://asolntsev.github.io/en)
