import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

const _mapProps = (props) => ({
  ...props,
});

const Markdown = (props) => 
<ReactMarkdown 
  remarkPlugins={[remarkMath]} 
  rehypePlugins={[rehypeKatex]} 
  {..._mapProps(props)} 
/>;

export default Markdown;