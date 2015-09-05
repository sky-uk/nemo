<style type="text/css">
	table {
		width: 100%;
	}
	
	.method {
		margin-top: 25px;
		font-size: 20px;
		padding: 5px;
		background-color: #eee;
		display: inline-block;
	}
	
	.method-section {
		margin-top: 25px;
		font-size: 16px;
		display: block;
	}

	.var-type {
  		color: #fff;
		padding: 1px 5px 2px 5px;
		border-radius: 3px;
	}
	
	.var-type-object {
  		background-color: #aaa;
	}
	
	.var-type-boolean {
		background-color: #bbbb00;
	}
	
	.var-type-string {
 		background-color: #00aaef;
	}
	
	.var-type-all {
		background-color: #dd0000;
	}
</style>

# Congratulations! You found Nemo!

This project is for rendering form elements and validating user input. It supports a particular data structure, defined [here](https://git.bskyb.com/kim.westley/nemo/wikis/data-structure)

It will NOT:
- Render labels for elements
- Render help text/tool tips for elements
- Submit the form
- Fetch any data
- Ensure that validation codes/rules are unique see [here](https://git.bskyb.com/kim.westley/nemo/wikis/unique-codes) for more info.

## Getting Started

##### If you don't have node run:

`./setup_node.sh`

Which will install nvm and node and run npm install

##### If you do have node:

The usual `npm install`
(You can install grunt globally and replace all local paths to grunt-cli with just `grunt`)
#### For developement locally:

`node_modules/grunt-cli/bin/grunt dev`

This will concat the js and start an express server on `localhost:3333` with / pointing to the root folder, along with a watcher.

There's a sample page available at `localhost:3333/app/sample/index.html`

#### For creating a distributable (unminifined):

`node_modules/grunt-cli/bin/grunt build`

#### For creating a distributable (minifined):

`node_modules/grunt-cli/bin/grunt build-and-min`

## Tests 

The test suite can be launched by triggering the following command:

`{path-to-node} node_modules/karma/bin/karma start test/conf/karma.conf.js --browsers=Chrome --reporters=dots`

## Contributing
To contribute please create a branch from master. Before commiting your changes to the branch, please run
`node_modules/grunt-cli/bin/grunt build` to create a new distributable.

Then talk to/email NowTV Web to let them know your code is ready for review!

## API

<label class="method">getFieldValues()</label>

Gets the list of values for each field of the form.

<label class="method-section">Parameters</label>

\-

<span class="method-section">Returns</span>

<label class="var-type var-type-object">Object</label> The list of values for each field of the form.

<label class="method">setFieldValue(fieldName, value, [skipRegisteredCheck])</label>

Sets the value of a field.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>
	<tr style="background-color: #fff;">
		<td>value</td>
		<td><label class="var-type var-type-all">*</label></td>
		<td>The value to be set</td>
	</tr>		
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">getFieldValue(fieldName, [skipRegisteredCheck])</label>

Gets the value of a field.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

<label class="var-type var-type-all">*</label> The value of the field

<label class="method">isFieldValid(fieldName, [skipRegisteredCheck])</label>

Checks whether the field is valid or not.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

<label class="var-type var-type-boolean">Boolean</label> The field validity.

<label class="method">isFieldTouched(fieldName, [skipRegisteredCheck])</label>

Checks whether the field has been touched or not.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

<label class="var-type var-type-boolean">Boolean</label> True if the field has been touched. False otherwise.

<label class="method">hasHelp(fieldName, [skipRegisteredCheck])</label>

Determines whether the field has contextual help attached to it or not.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

<label class="var-type var-type-boolean">Boolean</label> True if the field has contextual help. False otherwise.

<label class="method">isFieldActive(fieldName, [skipRegisteredCheck])</label>

Cheks whether the field is active or not.

NOTE: A field is consider active if:

1. It got the focus.

2. No one else got the focus afterwards. 

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

<label class="var-type var-type-boolean">Boolean</label> True if the field is active. False otherwise.

<label class="method">getFielNgModelCtrl(fieldName, [skipRegisteredCheck])</label>

Gets the ngModel controller of a field.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

<label class="var-type var-type-object">Object</label> The ngModel controller associated to the field.

<label class="method">forceInvalid(validationRuleCode, [skipRegisteredCheck])</label>

Sets a field as invalid.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>validationRuleCode</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The code of the validation rule</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">forceServerFieldInvalid(fieldName, errorMessage, Index, [skipRegisteredCheck])</label>

Forces a field as invalid.

Opposite to the ```forceInvalid``` method, this one manages an ad-hoc error instead of a registered one.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">setActiveField(fieldName, [skipRegisteredCheck])</label>

Marks a field as active.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">releaseActiveField(fieldName, [skipRegisteredCheck])</label>

Releases the active state of a field.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">setFieldDirtyTouched(fieldName, [skipRegisteredCheck])</label>

Marks a field as dirty and touched.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">validateForm([skipRegisteredCheck])</label>

Checks the validity of the form.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">validateFormAndSetDirtyTouched()</label>

Checks the validity of all the fields of the form, marking them as dirty and touched

<label class="method-section">Parameters</label>

\-

<span class="method-section">Returns</span>

\-

<label class="method">giveFieldFocus(fieldName, [skipRegisteredCheck])</label>

Sets the focus into a field.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-

<label class="method">giveFirstFieldInvalidFocus()</label>

Sets the focus into the first invalid field of the form.

<label class="method-section">Parameters</label>

\-

<span class="method-section">Returns</span>

\-

<label class="method">registerField(fieldName, [skipRegisteredCheck])</label>

Registers a field into the form controller, so its public interface methods will be reachable from there afterwards.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>fieldName</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The name of the field</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>
</table>

<span class="method-section">Returns</span>

\-

<label class="method">validationRuleCode(validationRuleCode, [skipRegisteredCheck])</label>

Registers a validation rule code into the form controller, so its public interface methods will be reachable from there afterwards.

<label class="method-section">Parameters</label>

<table style="padding: 0; margin: 0;">
	<tr style="background-color: #eee;">
		<th>Param</th>
		<th>Type</th>
		<th>Details</th>		
	</tr>
	<tr style="background-color: #fff;">
		<td>validationRuleCode</td>
		<td><label class="var-type var-type-string">String</label></td>
		<td>The code of the validation rule</td>
	</tr>	
	<tr style="background-color: #fff;">
		<td>skipRegisteredCheck</td>
		<td><label class="var-type var-type-boolean">Boolean</label></td>
		<td>Ignore non registered field error?</td>
	</tr>	
</table>

<span class="method-section">Returns</span>

\-
