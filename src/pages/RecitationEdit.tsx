import React, { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import type { BoxProps } from '@mui/material';
import { Box, Container, Typography } from '@mui/material';
import isString from 'lodash/isString';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';

import TextFieldControl from '../components/controls/TextFieldControl';
import SaveButton from '../components/SaveButton';
import { recitationSchema } from '../config/schemas';
import {
  fetchRecitations,
  persistRecitation,
  selectRecitationById,
} from '../redux/slices/recitations';
import { useAppDispatch, useAppSelector } from '../redux/store';
import type { RecitationDocument } from '../types';

function Block({
  header = '',
  children,
  ...props
}: {
  header: string;
} & BoxProps) {
  return (
    <Box
      bgcolor="paper.background.main"
      border="solid 1px"
      borderRadius="4px"
      borderColor="paper.border"
      boxShadow="4px 4px 10px rgba(0,0,0,0.05)"
      {...props}
    >
      {header && (
        <Box
          height={72}
          px={5}
          display="flex"
          alignItems="center"
          bgcolor="paper.header"
          borderBottom="solid 1px"
          borderRadius="4px 4px 0 0"
          borderColor="paper.border"
        >
          {isString(header) ? (
            <Typography variant="h6">{header}</Typography>
          ) : (
            header
          )}
        </Box>
      )}
      <Box p={5} px={8}>
        {children}
      </Box>
    </Box>
  );
}

function RecitationEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const recitationsStatus = useAppSelector((state) => state.recitations.status);
  const recitation = useAppSelector((state) =>
    selectRecitationById(state, `${params.recitationId}`),
  );
  const dispatch = useAppDispatch();
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(false);

  const form = useForm<RecitationDocument>({
    mode: 'onChange',
    resolver: yupResolver(recitationSchema),
    defaultValues: {
      content: [{ text: '' }],
    },
  });
  const {
    reset,
    handleSubmit: submitForm,
    formState: { isDirty, isSubmitting },
  } = form;

  const handleSubmit = async (data: RecitationDocument) => {
    setPersisting(true);

    const { payload } = await dispatch(persistRecitation(data));

    setPersisted(true);
    setPersisting(false);

    if (!params.recitationId) {
      navigate(`/recitations/${(payload as RecitationDocument).id}/edit`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    if (recitation) {
      reset({
        ...recitation,
        content: recitation.content.length
          ? recitation.content
          : [{ text: '' }],
      });
    }
  }, [recitation, reset]);

  useEffect(() => {
    if (recitationsStatus === 'idle') {
      dispatch(fetchRecitations());
    }
  }, [dispatch, recitationsStatus]);

  if (params.recitationId && !recitation) {
    return (
      <Box display="flex" justifyContent="center" m={5}>
        <BeatLoader color="#DDD" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <FormProvider {...form}>
        <Block header="Informations générales">
          <TextFieldControl
            name="title"
            label="Titre"
            disabled={isSubmitting}
          />
          <TextFieldControl
            name="content"
            label="Texte"
            multiline
            disabled={isSubmitting}
            transformIn={(data: RecitationDocument['content']) =>
              data.map((item) => item.text).join('\n\n')
            }
            transformOut={(data): RecitationDocument['content'] =>
              data.split(/\n{2,}/).map((text) => ({ text })) || []
            }
          />
        </Block>

        <SaveButton
          persisting={persisting}
          persisted={persisted}
          dirty={isDirty}
          onClick={submitForm(handleSubmit)}
          onHide={() => setPersisted(false)}
        />
      </FormProvider>
    </Container>
  );
}

export default RecitationEdit;
