import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import dToH from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import clsx from 'clsx';

import './style.scss';
import Alert from '../../utils/alert/Alert';
import Icon from '../../utils/Icon';

/**
 * Text input
 */
export default function Text(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const updateContent = (content) => {
    const html = dToH(content);
    props.onChange(html);
  }
  useEffect(() => {
    setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(props.value))));
  }, [props.value]);
  const { children, className, errors, icon, type = 'text', placeholderLabel } = props,
        empty = isEmpty(props.value),
        label = placeholderLabel ? props.placeholder : props.label,
        input = omit(props, ['children', 'className', 'errors', 'placeholderLabel', 'reference']);
  return (
    <label className={clsx('Rich-Text', className, 'type-' + type, { empty, 'placeholder-label': placeholderLabel })}>
      {(!label ? '' :
        <span className="label">{label}</span>
      )}
      {(!icon ? '' :
        <Icon value={icon} />
      )}
      <Editor
        editorState={editorState}
        onEditorStateChange={(state) => setEditorState(state)}
        onContentStateChange={updateContent}
      />
      {/* {children} */}
      <Alert wrap={['(', ')']}>{errors}</Alert>
    </label>
  );
}
