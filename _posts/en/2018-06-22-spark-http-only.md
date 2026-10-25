---
layout: post
category: en
title: Spark doesn't mark session cookie as HttpOnly
---

Ahtung!
I recently discovered that Spark framework doesn't add the `HttpOnly` attribute to the session cookie.

This means there is a security hole in every web application that uses Spark.

<!--more-->

The `HttpOnly` attribute prevents JavaScript on the page from reading the cookie. Without it, any XSS vulnerability
lets an attacker steal the session cookie (`document.cookie`) and log in as somebody else.

There is already a [pull request](https://github.com/perwendel/spark/pull/965) that fixes it, but the authors
are in no hurry to merge it. :(

Meanwhile, you can close the hole with the following workaround.

### Step 1

Register your own Jetty factory before starting Spark:

```java
import spark.embeddedserver.EmbeddedServers;
import spark.embeddedserver.jetty.SecureEmbeddedJettyFactory;
import static spark.embeddedserver.EmbeddedServers.Identifiers.JETTY;

public class Application {
  public static void main(String[] args) {
    EmbeddedServers.add(JETTY, new SecureEmbeddedJettyFactory());
    // ... start Spark here ...
  }
}
```

### Step 2

Create the factory itself. Note that it must be placed in package `spark.embeddedserver.jetty`,
because it uses package-private Spark classes.

```java
package spark.embeddedserver.jetty;

import spark.embeddedserver.EmbeddedServer;
import spark.http.matching.MatcherFilter;
import spark.route.Routes;
import spark.staticfiles.StaticFilesConfiguration;

public class SecureEmbeddedJettyFactory extends EmbeddedJettyFactory {
  private final JettyServerFactory serverFactory = new JettyServer();

  public EmbeddedServer create(Routes routeMatcher, StaticFilesConfiguration staticFilesConfiguration, boolean hasMultipleHandler) {
    MatcherFilter matcherFilter = new MatcherFilter(routeMatcher, staticFilesConfiguration, false, hasMultipleHandler);
    matcherFilter.init(null);

    JettyHandler handler = new JettyHandler(matcherFilter);
    handler.setHttpOnly(true);
    return new EmbeddedJettyServer(serverFactory, handler);
  }
}
```

That's it: now the session cookie comes with the `HttpOnly` flag. You can check it in the browser DevTools,
on the Application → Cookies tab.

[Andrei Solntsev](https://twitter.com/asolntsev)

[asolntsev.github.io](https://asolntsev.github.io/en)
