---
layout: post
category: ru
title: Почему разработчики должны быть хорошими тестировщиками
---

Это мой ответ на статью о том, [почему разработчики не могут быть хорошими тестировщиками](http://software-testing.ru/library/testing/general-testing/2277-why-cant-developers-be-good-testers).

> вы можете научить собаку нескольким трюкам, но вы уж точно не сможете научить ее летать.

Всё это полная ерунда!
Собаку нельзя научить летать, потому что она физически по-другому устроена.
А разработчики и тестировщики устроены ОДИНАКОВО!

<!--more-->

По каждому приведённому пункту: если это могут тестировщики, то смогут и разработчики.

### 1. “Родительские чувства” к коду
> Разработчики привязаны к тому, что они пишут. Может быть это прозвучит глупо, но очень сложно оценивать объективно то, что ты создаешь.

Вы могли обратить внимание на то, что нормальный родитель относится к своим детям наиболее требовательно. Я хочу, чтобы код - моё детище - хорошо работало, и чтобы ни у кого не было ни малейшей причины его критиковать. Поэтому я очень хочу найти в нём баги.

### 2. Акцентирование на позитивных моментах
> Работа разработчика основывается на позитивных сценариях и их реализации в продукте. Чтобы работать тестировщиком нужно иметь диаметрально противоположный склад ума, так как тестировщики всегда акцентируются на негативных сторонах продукта нежели чем на позитивных. Следовательно разработчику нужно поменять склад ума, чтобы стать тестировщиком, а это не кажется столь реальным на мой взгляд.

Это правда, в период "созидания" я концентрируюсь на том, как СДЕЛАТЬ. 
Но я никогда на этом не заканчиваю. Потом наступает следующий период, когда я пересматриваю и улучшаю код, иногда по много раз. Перепроверяю и дописываю тесты. Критически думаю, а что там может СЛОМАТЬСЯ. Ведь я не хочу, чтобы моё детище критиковали.

Если разработчик после первого этапа считает дело сделанным, то это не разработчик, а ребёнок. Не надо по ним судить.

### 3. Работа на основе принципа упрощения сложных вещей
> Рассматривание сложных сценариев с целью нахождения багов является одной из составляющих процесса тестирования. В двух словах мы берем простую вещь и придумываем как ее можно усложнить.
  Разработчики поступают ровно наоборот. Они берут сложный процесс или проект и разбивают его на более мелкие компоненты с целью найти решение проблемы.

Ровно то же самое, что п. 2. Вначале я упрощаю, потом усложняю.

### 4. Неспособность видеть мелкие детали на большой картине
> Одним из основных качеств любого тестировщика является умение определить что не так на этой картине. Разработчики говорят, что у тестировщиков нюх на баги. Возможно это утверждение не так далеко от истины.

Это правда, такая проблема часто есть у разработчиков. Но если это могут сделать тестировщики, то могут и разработчики. У них точно такой же мозг.

Да не просто могут, а обязаны! 
Как иначе без видения общей картины они смогут хорошо спроектировать программу?

Если они сделают программу без учёта всего этого, а потом придут тестировщики и скажут, что не годится - это будет
СЛИШКОМ ПОЗДНО! Придётся переписывать и потратить вдвое больше времени. 

### 5. Недостаток опыта работы с типичными багами и программными ошибками
> Все приходит с опытом, и знание типичных багов и программных ошибок не исключение. Опытный тестировщик видит форму и сразу начинает думать какие типичные баги там могут скрываться и что следовательно может быть протестировано в первую очередь.

Да с какой это стати недостаток? Почему?
За всю свою карьеру я сделал такое множество багов, что опыта работы с ними хоть отбавляй.

Я думаю, разработчики всё это прекрасно могут, но обычно не хотят. Тупо лень. 
А лень потому, что они знают, что они не последний рубеж. 
За ними есть ещё обезьянки-тестировщики, которые налетят и за них их работу сделают. 

В итоге всем хуже: разработчики сильно не напрягаются, не очень хорошо продумывают дизайн программы, 
не продумывают все крайние случаи, не пишут юнит-тесты. 
Проблемы растут лавинообразно, и тестировщики не могут их всех сдержать. 

* Тестировщики не могут обнаружить все неучтённые кейсы. Лишь некоторые.
* Тестировщики не могут найти все баги. Лишь некоторые. Вы знаете, некоторые баги невозможно повторить. 
* Тестировщики-автоматизаторы не могут покрыть интеграционными тестами всё, что должно 
было быть покрыто юнит-тестами. Вы знаете, некоторые баги вообще невозможно покрыть интеграционными тестами, только юнит.  

Мир катится в пропасть.

[Андрей Солнцев](https://twitter.com/asolntsev) 

[asolntsev.github.io](https://asolntsev.github.io/ru)