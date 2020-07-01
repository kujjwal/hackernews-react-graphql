import * as React from 'react';
import { DataValue } from 'react-apollo';
import { NewsItemModel } from '../data/models';
import { LoadingSpinner } from './loading-spinner';
import { NewsDetail, newsDetailNewsItemFragment } from './news-detail';
import { NewsTitle, newsTitleFragment } from './news-title';
import { useEffect } from 'react';
export interface INewsFeedProps {
  currentUrl: string;
  first: number;
  isJobListing?: boolean;
  isPostScrutinyVisible?: boolean;
  isRankVisible?: boolean;
  isUpvoteVisible?: boolean;
  newsItems: Array<NewsItemModel | null>;
  notice?: JSX.Element;
  skip: number;
}
export const newsFeedNewsItemFragment = `
  fragment NewsFeed on NewsItem {
    id
    hidden
    ...NewsTitle
    ...NewsDetail
  }
  ${newsTitleFragment}
  ${newsDetailNewsItemFragment}
`;
export function NewsFeedView(props: INewsFeedProps): JSX.Element {
  const {
    isPostScrutinyVisible = false,
    first,
    newsItems,
    notice = null,
    skip,
    isJobListing = false,
    isRankVisible = true,
    isUpvoteVisible = true,
    currentUrl,
  } = props;
  const nextPage = Math.ceil((skip || 1) / first) + 1;
  useEffect(() => {
    console.log('useEffect');
    const alanBtn = require('@alan-ai/alan-sdk-web');
    let alanButton = alanBtn({
      key: "868af7a47f1ae52c7628bc60849ece862e956eca572e1d8b807a3e2338fdd0dc/stage",
      rootEl: document.getElementById("alan-btn"),
    });
  },[]);
  console.log(newsItems);
  for (var i = 0; i < newsItems.length; i++) {
    if (newsItems[i] != null) {
      console.log(newsItems[i].title);
    }
  }
  return (
    <tr>
        <td style={{ padding: '0px' }}>
        <table
              style={{
                border: '0px',
                padding: '0px',
                borderCollapse: 'collapse',
                borderSpacing: '0px',
              }}
              className="itemlist"
          >
            <tbody>
            {notice && notice}
            <>
              {newsItems
                  .filter((newsItem): newsItem is NewsItemModel => !!newsItem && !newsItem.hidden)
                  .flatMap((newsItem, index) => [
                    <NewsTitle
                        key={`${newsItem.id}title`}
                        isRankVisible={isRankVisible}
                        isUpvoteVisible={isUpvoteVisible}
                        rank={skip + index + 1}
                        {...newsItem}
                    />,
                    <NewsDetail
                        key={`${newsItem.id}detail`}
                        isFavoriteVisible={false}
                        isPostScrutinyVisible={isPostScrutinyVisible}
                        isJobListing={isJobListing}
                        {...newsItem}
                    />,
                    <tr className="spacer" key={`${newsItem.id}spacer`} style={{ height: 5 }} />,
                  ])}
              <tr key="morespace" className="morespace" style={{ height: '10px' }} />
              <tr key="morelinktr">
                <td key="morelinkcolspan" colSpan={2} />
                <td key="morelinktd" className="title">
                  <a
                      key="morelink"
                      href={`${currentUrl}?p=${nextPage}`}
                      className="morelink"
                      rel="nofollow"
                  >
                    More
                  </a>
                </td>
              </tr>
            </>
            </tbody>
          </table>
        </td>
        <div id="alan-btn" />
      </tr>
  );
}
export interface INewsFeedData {
  error;
  feed;
  loading;
}
export interface INewsFeedContainerProps {
  currentUrl: string;
  data: DataValue<INewsFeedData, {}>;
  first: number;
  isJobListing?: boolean;
  isRankVisible?: boolean;
  isUpvoteVisible?: boolean;
  notice?: JSX.Element;
  skip: number;
}
export const NewsFeed: React.SFC<INewsFeedContainerProps> = (props) => {
  const { data, currentUrl, first, skip, notice } = props;
  if (data?.error) {
    return (
        <tr>
          <td>Error loading news items.</td>
        </tr>
    );
  }
  if (data?.feed?.length) {
    return (
        <NewsFeedView
            newsItems={data?.feed}
            currentUrl={currentUrl}
            first={first}
            skip={skip}
            notice={notice}
        />
    );
  }
  return <LoadingSpinner />;
};
