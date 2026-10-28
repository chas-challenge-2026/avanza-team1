# Java - Backend, / Erik :)

## I'm writing this in English as it's my native Language when programming :)

### There have been some changes i've done in order to get the JNA Bridge to work properly while also adding some QoL features. I'm going to do my best in explaining this while being tired and there is only one hour left until its Thursday, so i wanted to complete this as fast as possible:

## Changes:

### Added: 
### I have opened two instances through docker to allow remote installation through "Git" & "libssl-dev".
### Context: It was the fastest way for me to integrate Jansson and CURL before the end of the week, though it comes with its complications on the security side. It allows you to automatically install the required libraries on start-up in case you do not have the files required to boot. I have already accounted for the case IF the server already have the packages installed it simply ignores it and keeps going for performance sake, thanks to "FIND_PACKAGE_ARGS" on (line 21, 32) in CMakeLists.txt.
### Security: While it is a good implementation, it's not for production code because we've added additional pipelines to be infiltrated from. Hardware like ports used during installation and server bootup, and the risk of "dependency injection". 
### There's also the Single Point of Failure risk where currenty (used) version could already have security holes & another where the developers simply change directories for the library which could indicate a crash on startup requiring more maintence than necessary.
### In the future we or Avanza need to assess this situation and its vulnerabilities and plan accordingly.

### Changed: 
### I've taken the time to change up some of the architecture while keeping it to a minimum as there was a lot of points to improve up'on. Before i keep writing about this i have NOT made any major changes that could impact the future production environment of Native, this is mainly and strictly the Backtest part and minor changes to integrate fx and logger into Backetest, as this will be needed by frontend when they get access to the Backtest-Module.
### While some problems happened trying to introduce the variable for "currency", i adapted to fix each problem optimally and therefore some changes can be found in the code. There were multiple instances where some code were running before the required code leading to multiple instances of data leakage, compiler failure and library crashes. Those that i took action against and fixed.
### I've simplified the sanitizer and used variable lookups in this case so instead of multiple single point run times i've amassed it to one executable list that now runs with the proper compiler.
### I've also logged each edit in the code which you can find with "//" or "- Svartakatten".
### While looking at your chosen libraries, like Jansson specifically i've noticed some changes in newer cmake libraries and Jansson is about to be deprecated as cmake are making moves to remove parts of the code that runs it. Therefore better alternatives are to be found in the future.
### One code snippet i added was the code block under this description, "Protects against unsigned underflow if API would return less days than requested " and another instance "Copies currency to heap so that JNA can read the string securely". These was added due to a code leakage happening while testing & experimenting with the code.
### While getting the testing to work, the code now is mainly automatic and should be able to run on most devices without additional additions. Some libraries have been added to clean up parts of the code and some code were simply placed after it was needed.

### The variable currency can now be passed through the JNA Bridge and returned to frontend (it's even ready for currency conversion, if we or another wanted to add it in the future), meaning we are mainly done here and if we have time we might be able to add the api through the JNA bridge before we send in the code.

### I'll be ending it now before the time runs out and i've mostly added what i wanted to say. If any implications or negative feeling regarding this, you are most welcome to share and in worst case rollback though i don't think we will need to rollback because these iterations are of most importance.