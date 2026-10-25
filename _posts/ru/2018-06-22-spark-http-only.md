---
layout: post
category: ru
title: Дырявый Spark не помечает сессионную куку как HttpOnly
---

Ахтунг!
Я недавно обнаружил, что Spark framework не добавляет атрибут `HttpOnly` к сессионной куке.

А это значит, что дыра в безопасности есть в каждом веб-приложении, которое использует Spark.

<!--more-->

Атрибут `HttpOnly` запрещает JavaScript-коду на странице читать куку. Без него любая XSS-уязвимость
позволяет злоумышленнику утащить сессионную куку (`document.cookie`) и войти в систему под чужим именем.

Уже есть [пулл-реквест](https://github.com/perwendel/spark/pull/965), который это исправляет, но авторы
не торопятся его мержить. :(

Пока что можно закрыть дыру вот таким воркэраундом.

### Шаг 1

Перед стартом Spark зарегистрируйте свою фабрику для Jetty:

```java
import spark.embeddedserver.EmbeddedServers;
import spark.embeddedserver.jetty.SecureEmbeddedJettyFactory;
import static spark.embeddedserver.EmbeddedServers.Identifiers.JETTY;

public class Application {
  public static void main(String[] args) {
    EmbeddedServers.add(JETTY, new SecureEmbeddedJettyFactory());
    // ... здесь запускаем Spark ...
  }
}
```

### Шаг 2

Создайте саму фабрику. Обратите внимание: она должна лежать в пакете `spark.embeddedserver.jetty`,
потому что использует package-private классы Spark.

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

Готово: теперь сессионная кука приходит с флагом `HttpOnly`. Проверить можно в DevTools браузера
на вкладке Application → Cookies.

[Андрей Солнцев](https://twitter.com/asolntsev)

[asolntsev.github.io](https://asolntsev.github.io/ru)
