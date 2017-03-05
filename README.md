# CoreServices framework info

`CoreServices` is a framework located at:
`/System/Library/Frameworks/CoreServices.framework`

Looking inside the bridgesupport file indicates that it
includes numerous other frameworks.

One of these is `DictionaryServices` located at:
`/System/Library/Frameworks/CoreServices.framework/Frameworks/DictionaryServices.framework`

# DictionaryServices bridgesupport parsing

When the `.bridgesupport` file for `DictionaryServices` is parsed by `NodObjC`
it does not properly register a method for the function `DCSCopyTextDefinition`.

The only way I was able to get `NodObjC` to register this function is by
pointing the `.bridgesupport` file to my own copy which I modified by copying
the xml for the function and putting it in the file twice.  

```xml
...
<function name='DCSCopyTextDefinition'>
<arg type='^{__DCSDictionary=}'/>
<arg type='^{__CFString=}'/>
<arg type='{_CFRange=ii}' type64='{_CFRange=qq}'/>
<retval already_retained='true' type='^{__CFString=}'/>
</function>
<function name='DCSCopyTextDefinition'>
<arg type='^{__DCSDictionary=}'/>
<arg type='^{__CFString=}'/>
<arg type='{_CFRange=ii}' type64='{_CFRange=qq}'/>
<retval already_retained='true' type='^{__CFString=}'/>
</function>
...
```

This allowed the function to be added to `NodObjC` after requiring
`CoreServices` (`CoreServices` includes the `DictionaryServices` framework as a dependency)

# NodObjC findTags function
This makes me believe that a problem might exist with the `findTags` function here 
(https://github.com/TooTallNate/NodObjC/blob/master/lib/import.js#L97)

# Segfault issue
After getting `NodObjC` to recognize the method I tried using it and got a
segfault and I am having trouble debugging this further.

# General info
This repo has the code showing the error that I am getting.  I have also included
`pryjs` and `segfault-handler` to help with debugging.

# Workflow
After cloning this repo make sure you run: `git submodule update --init` to
fetch the `NodObjC` folder from my fork into the `deps/NodObjc` folder.
To debug this issue so far I have been making  modifications to `deps/NodObjC`
then running `npm run start` to test my changes. (this uses a shell script in
`bin/clean` to reinstall `NodObjC` from the `deps/NodObjc` folder.)

# Deps folder
I included a `deps` folder where I put a modified version of `NodObjC` that causes
a custom bridgesupport file (located in the overrides folder)  to be loaded
for `DictionaryServices`.  This allows the `DCSCopyTextDefinition` to be detected.

# Bin folder
Inside the `bin` folder is a shell script that cleans the `node_modules/NodObjC`
folder out and then runs `npm install` to pull it in from the `deps` folder.

# Crashlog
The crash log is currently stored in the `debug` folder after each segfault
occurs.

# Working objective c example
To see the code I am translating to NodObjC please see this repo:
`https://github.com/afaur/dict`
