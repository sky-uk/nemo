# Contributing to Nemo

We'd love for you to contribute to our source code and to make Nemo even better than it is today!
Here are the guidelines we'd like you to follow:

 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)

## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use Nemo, please direct these to [dl-nowtv-webteam@sky.uk][email].

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue to our [GitHub Repository][github]. Even better you can submit a Pull Request
with a fix.

**Please see the Submission Guidelines below**.

## <a name="feature"></a> Want a Feature?
You can request a new feature by submitting an issue to our [GitHub Repository][github].
If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be addressed first on our
[email][email] so that we can better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Changes** can be crafted and submitted to the [GitHub Repository][github] as a Pull
Request.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new features, by not reporting
duplicate issues.
Providing the following information will increase the chances of your issue being dealt with quickly:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **Nemo Version(s)** - is it a regression?
* **Browsers and Operating System** - is this a problem with all browsers or only IE8?
* **Reproduce the Error** - provide a live example (using [Plunker][plunker] or [JSFiddle][jsfiddle])
or a unambiguous set of steps.
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
causing the problem
(line of code or commit)

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/sky-uk/nowtv-web-nemo/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Run the full Nemo test suite, and ensure that all tests pass.
Nemo tests are's based on Karma, so if you need any help with the test runner, please have a look to
its [config](https://github.com/karma-runner/karma).
* Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit-message-format)
Adherence to the [commit message conventions](#commit-message-format) is required because release
notes are automatically generated from these messages.

     ```shell
     git commit -a
     ```

    Note: the optional commit `-a` command line option will automatically "add" and "rm" edited
    files.

* Build your changes locally to ensure all the tests pass:

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `nemo:master`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the Nemo test suite to ensure tests are still passing.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push origin my-fix-branch -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```shell
    git checkout master -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:
* Don't create methods with more than **10 lines each**.
* Don't create components with more than **100 lines each**.
* keep just up to one `var` statement for each method, at the very beginning of its main closure.
* Keep just op to one `return` statement, at the very end of its main closure.
* With the exceptions listed below, we follow the rules contained in [Google's JavaScript Style Guide][js-style-guide]:
    * Wrap all code at **100 characters**.
    * Instead of complex inheritance hierarchies, we **prefer simple objects**. We use prototypal
      inheritance only when absolutely necessary.
    * We **love functions and closures** and, whenever possible, prefer them over objects.

## <a name="commit"></a> Git Commit Guidelines

We have some rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the Nemo change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<(@)author> <type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of
the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is
the SHA of the commit being reverted.

### Author
The github account of the responsible of the commit.
Please use the '@' preffix if the author points to an actual gitHub username.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scope
The scope could be anything specifying place of the commit change. For example `formHandlerCtrl`, `inputProvider`,
`validationProvider`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [AngularJs document][commit-message-format].


[email]: mailto:dl-nowtv-webteam@sky.uk
[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[github]: https://github.com/sky-uk/nowtv-web-nemo
[js-style-guide]: http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
[jsfiddle]: http://jsfiddle.net/
[plunker]: http://plnkr.co/edit