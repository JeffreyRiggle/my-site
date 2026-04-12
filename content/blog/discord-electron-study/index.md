---
title: 'Something about electron and discord'
date: '2026-04-12'
---

Topics for consideration

* global topics
    * Used moment but then didn't fully utilize it
    * Yarn vs npm
    * No unit tests
    * Build a library to handle that for me that is no longer needed
    * Still wasn't using typescript.
    * Much of what I feel compelled to critique is preference (destructuring, null handling, etc)
* browser asset topics
    * Built in a way that there had been two different experiences. A native browser and electron app version
    * Observation that this would have been a perfect case for redux
    * Used scss this time (do I actually care to talk about this)
    * React defaults around linting are annoying
    * Writing files is silly but recently they introduced https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write wow
    * Didn't really use a component library but pulled in libraries for tooltip and datepicker
    * React class vs functional components (just coming back I felt compelled to use functional even though I didn't need it)
        * bind all the things
* desktop topics
    * Weird health check logic
    * Different behaviors for dev verses production mode (dev tools/site url)
    * Pretty funny how docker start worked if the operation didn't complete within 5 seconds it was considered a failure
    * Used okctokit to download a single file from GH that could have been a single HTTP request