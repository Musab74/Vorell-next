import React, { useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import { Box, Stack, CircularProgress } from '@mui/material';

const TViewer = (props: any) => {
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(!!props.markdown);
  }, [props.markdown]);

  return (
    <Stack className="lux-watch-viewer">
      <Box className="viewer-shell">
        {editorLoaded ? (
          <Viewer
            initialValue={props.markdown}
            customHTMLRenderer={{
              htmlBlock: {
                iframe(node: any) {
                  return [
                    {
                      type: 'openTag',
                      tagName: 'iframe',
                      outerNewLine: true,
                      attributes: {
                        ...node.attrs,
                        loading: 'lazy',
                        referrerpolicy: 'no-referrer',
                        allow: 'autoplay; fullscreen; picture-in-picture',
                      },
                    },
                    { type: 'html', content: node.childrenHTML ?? '' },
                    { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
                  ];
                },
                div(node: any) {
                  return [
                    { type: 'openTag', tagName: 'div', outerNewLine: true, attributes: node.attrs },
                    { type: 'html', content: node.childrenHTML ?? '' },
                    { type: 'closeTag', tagName: 'div', outerNewLine: true },
                  ];
                },
              },
              htmlInline: {
                big(node: any, { entering }: any) {
                  return entering
                    ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                    : { type: 'closeTag', tagName: 'big' };
                },
              },
            }}
          />
        ) : (
          <Stack className="loading">
            <CircularProgress />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default TViewer;
