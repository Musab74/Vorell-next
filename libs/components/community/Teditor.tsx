import React, { memo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { NEXT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { useMutation } from '@apollo/client';
import { Message } from '../../enums/common.enum';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null);
  const token = getJwtToken();
  const router = useRouter();

  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  const uploadImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append(
        'operations',
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target) 
          }`,
          variables: { file: null, target: 'article' },
        })
      );
      formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
      formData.append('0', image);

      const response = await axios.post(`${process.env.NEXT_APP_API_GRAPHQL_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'apollo-require-preflight': true,
          Authorization: `Bearer ${token}`,
        },
      });

      const responseImage = response.data?.data?.imageUploader;
      return `${NEXT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log('Error, uploadImage:', err);
    }
  };

  const changeCategoryHandler = (e: any) => {
    setArticleCategory(e.target.value as BoardArticleCategory);
  };

  const articleTitleHandler = (e: T) => {
    setTitle((e.target as HTMLInputElement).value);
  };

  const handleRegisterButton = async () => {
    try {
      // make sure we have the latest content from the editor
      const latestContent = editorRef.current?.getInstance().getHTML() as string;
      setContent(latestContent);

      const finalTitle = title?.trim();
      const finalContent = (latestContent ?? content)?.trim();

      if (!finalTitle || !finalContent) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      if (submitting) return;
      setSubmitting(true);

      await createBoardArticle({
        variables: {
          input: {
            articleTitle: finalTitle,
            articleContent: finalContent,
            articleImage: '', // set if you store a cover separately
            articleCategory,
          },
        },
      });

      await sweetTopSmallSuccessAlert('Article created successfully!', 700);
      await router.push({
        pathname: '/community',
        query: { category: 'myArticles' },
      });
    } catch (err: any) {
      console.error('Error creating article:', err);
      await sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS));
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || !title.trim() || !content.trim();

  return (
    <Stack className="lux-watch-editor">
      <Stack direction="row" className="editor-topbar" justifyContent="space-evenly">
        <Box component="div" className="form_row">
          <Typography className="label" variant="h3">Category</Typography>
          <FormControl className="field-control">
            <Select
              value={articleCategory}
              onChange={changeCategoryHandler}
              displayEmpty
              inputProps={{ 'aria-label': 'Category' }}
              className="select"
            >
              <MenuItem value={BoardArticleCategory.FREE}>General</MenuItem>
              <MenuItem value={BoardArticleCategory.HUMOR}>Light Talk</MenuItem>
              <MenuItem value={BoardArticleCategory.NEWS}>Watch News</MenuItem>
              <MenuItem value={BoardArticleCategory.RECOMMEND}>Recommendations</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box component="div" className="form_row title_row">
          <Typography className="label" variant="h3">Title</Typography>
          <TextField
            onChange={articleTitleHandler}
            id="article-title"
            label="Write a refined headline"
            className="title-input"
          />
        </Box>
      </Stack>

      <Editor
        initialValue={'Share your perspective on haute horlogerie.'}
        placeholder={'Compose your post…'}
        previewStyle={'vertical'}
        height={'640px'}
        // @ts-ignore
        initialEditType={'WYSIWYG'}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['image', 'table', 'link'],
          ['ul', 'ol', 'task'],
        ]}
        ref={editorRef}
        hooks={{
          addImageBlobHook: async (image: any, callback: any) => {
            const uploadedImageURL = await uploadImage(image);
            callback(uploadedImageURL);
            return false;
          },
        }}
        // keep state in sync so the Publish button enables/disables correctly
        onChange={() => {
          const html = editorRef.current?.getInstance().getHTML() as string;
          setContent(html || '');
        }}
      />

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          className="submit-btn"
          onClick={handleRegisterButton}
          disabled={isDisabled}
        >
          {submitting ? 'Publishing…' : 'Publish'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default memo(TuiEditor);
