# v2.0

- Add the ability to serialize/restore using any attribute to identify the list items
- Remove unnecessary entries from serialization data structure (items without ids or children need not be included)
- Checkbox ids are now sequential - if you want to address a checkbox use a selector that targets ".the-list-item > input"
- Remove the need for guid, generatedIdPrefix, specifiedIdPrefix and adding generated ids to list items
