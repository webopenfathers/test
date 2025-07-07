import React from 'react';

import { useParams } from 'react-router-dom';

import { ErrorBlock } from '@/bases';
import Loading from '@/components/loading';

import { useRequest } from '@/hooks/useRequest';
import type { IBookInfo } from '@/types/book';

import api from './api';

import DetailHeader from './components/detailHeader';
import DetailContent from './components/detailContent';
import DetailFooter from './components/detailFooter';

const Detail: React.FC = () => {
  const id = useParams().id as string;
  const { data, error } = useRequest<IBookInfo>({ url: api.getBook(id) });

  if (error) return <ErrorBlock />;

  if (!data) return <Loading />;

  return (
    <>
      <DetailHeader />
      <DetailContent />
      <DetailFooter />
    </>
  );
};

export default Detail;
