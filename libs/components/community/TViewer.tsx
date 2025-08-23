import React, { useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import { Box, Stack, CircularProgress } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface TViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  markdown?: string;
}

const containerSx: SxProps<Theme> = {};
const shellSx: SxProps<Theme> = {};
const loadingSx: SxProps<Theme> = { alignItems: 'center', justifyContent: 'center', py: 4 };

const TViewer = ({ markdown, className, ...rest }: TViewerProps) => {
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(!!markdown);
  }, [markdown]);

  return (
    <Stack
      component="div"
      className={`lux-watch-viewer ${className ?? ''}`}
      sx={containerSx}
      {...rest}
    >
      <Box component="div" className="viewer-shell" sx={shellSx}>
        {editorLoaded ? (
          <Viewer
            initialValue={markdown}
            // Loosen types to avoid union blowups
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customHTMLRenderer={{
              htmlBlock: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                div(node: any) {
                  return [
                    { type: 'openTag', tagName: 'div', outerNewLine: true, attributes: node.attrs },
                    { type: 'html', content: node.childrenHTML ?? '' },
                    { type: 'closeTag', tagName: 'div', outerNewLine: true },
                  ];
                },
              },
              htmlInline: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                big(node: any, { entering }: any) {
                  return entering
                    ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                    : { type: 'closeTag', tagName: 'big' };
                },
              },
            } as any}
          />
        ) : (
          <Stack component="div" className="loading" sx={loadingSx}>
            <CircularProgress />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default TViewer;
