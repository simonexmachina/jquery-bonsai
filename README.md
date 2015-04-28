# jQuery Bonsai

#### [Visit project page and demos](http://aexmachina.info/jquery-bonsai)

`jquery-bonsai` is a lightweight jQuery plugin that takes a big nested list and prunes it down to a small expandable 
tree control.

Also includes support for checkboxes (including 'indeterminate' state) and for populating the tree using a JSON data source.

See [aexmachina.github.io/jquery-bonsai/](http://aexmachina.github.io/jquery-bonsai/) for more information.

## Installation

```
bower install jquery-bonsai --save
```

## Usage

```
$('ul#my-nested-list').bonsai();
```

## API

### `$.fn.bonsai(options)`

```js
$('#list').bonsai({
  expandAll: false, // expand all items
  expand: null, // optional function to expand an item
  collapse: null, // optional function to collapse an item
  addExpandAll: false, // add a link to expand all items
  addSelectAll: false, // add a link to select all checkboxes
  selectAllExclude: null, // a filter selector or function for selectAll

  // createInputs: create checkboxes or radio buttons for each list item
  // using a value of "checkbox" or "radio".
  //
  // The name and value for the inputs can be declared in the
  // markup using `data-name` and `data-value`.
  //
  // The name is inherited from parent items if not specified.
  //
  // Checked state can be indicated using `data-checked`.
  createInputs: false,
  // checkboxes: run qubit(this.options) on the root node (requires jquery.qubit)
  checkboxes: false,
  // handleDuplicateCheckboxes: update any other checkboxes that
  // have the same value
  handleDuplicateCheckboxes: false
});
```

### `Bonsai#update()`

If the DOM changes then you'll need to call `#update`:

```js
$('#list').bonsai('update');
```

### Expanding/collapsing items

- `Bonsai#expand(listItem)`
- `Bonsai#collapse(listItem)`
- `Bonsai#toggle(listItem)`
- `Bonsai#expandAll(listItem)`
- `Bonsai#collapseAll(listItem)`

```js
$('#list').bonsai('expand', listItem);
```

### `Bonsai#serialize()`

Returns an object representing the expanded/collapsed state of the list.
The identify of the list items for serialize and restore is based on the `id` or `data-bonsai-id` attributes.

```js
var bonsai = $('#list').data('bonsai');
var state = bonsai.serialize();
```

### `Bonsai#restore()`

Restores the expanded/collapsed state of the list using the return value of `#serialize()`.

```js
var bonsai = $('#list').data('bonsai');
var state = bonsai.serialize();
// do stuff that changes the DOM, and may not retain collapsed state
bonsai.update(); // update to handle any new DOM elements
bonsai.restore(state); // restores the collapsed state
```
