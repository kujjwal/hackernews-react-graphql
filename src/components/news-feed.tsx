import * as React from 'react';
import { DataValue } from 'react-apollo';
import { NewsItemModel } from '../data/models';
import { LoadingSpinner } from './loading-spinner';
import { NewsDetail, newsDetailNewsItemFragment } from './news-detail';
import { NewsTitle, newsTitleFragment } from './news-title';
import Box from '@material-ui/core/Box';
import {APP_URI} from "../config";

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
  const [title, setTitle] = React.useState(
      'Placeholder'
  );

  React.useEffect(() => {
    const alanBtn = require('@alan-ai/alan-sdk-web');
    let alanButton = alanBtn({
      key: "59d47fd608d51a967628bc60849ece862e956eca572e1d8b807a3e2338fdd0dc/stage",
      rootEl: document.getElementById("alan-btn"),
      onCommand: function (commandData) {
          if (commandData.command === "highlightTitle") {
            setTitle(commandData.title);
          }
          if (commandData.command === "homePage") {
            window.open(`${APP_URI}/news`, 'Hacker News Clone');
          }
          if (commandData.command === "newPage") {
            window.open(`${APP_URI}/newest`, 'Hacker News Clone');
          }
          if (commandData.command === "showPage") {
            window.open(`${APP_URI}/show`, '_blank');
          }
          if (commandData.command === "openLink") {
            const num = commandData.value - 1;
            const index = num - (newsItems.length * (nextPage - 2));
            const url = newsItems[index].url;
            window.open(url, '_blank');
          }
          if (commandData.command === "nextPage") {
            window.open(`${APP_URI}?p=${nextPage}`, '_blank');
          }
          if (commandData.command === "commentsPage") {
              window.open(`${APP_URI}/newcomments`, '_blank');
          }
          if (commandData.command === "askPage") {
              window.open(`${APP_URI}/ask`, '_blank');
          }
          if (commandData.command === "jobsPage") {
              window.open(`${APP_URI}/jobs`, '_blank');
          }
      },
    });
    var headlineList = [];
    for (var i = 0; i < newsItems.length; i++) {
        if (newsItems[i] != null) {
            headlineList.push(newsItems[i].title);
        }
    }
    alanButton.setVisualState({headlines: headlineList});
  },[]);
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
                  .flatMap((newsItem, index) => {
                    var defaultProps;
                    if (newsItem.title == title) {
                      defaultProps = {
                          borderColor: "yellow",
                          border: 2,
                      };
                    }
                    else {
                      defaultProps = {
                          border: 0,
                      };
                    }
                    return ([
                        <Box {...defaultProps}>
                            <NewsTitle
                                key={`${newsItem.id}title`}
                                isRankVisible={isRankVisible}
                                isUpvoteVisible={isUpvoteVisible}
                                rank={skip + index + 1}
                                {...newsItem}
                            />
                            <NewsDetail
                                key={`${newsItem.id}detail`}
                                isFavoriteVisible={false}
                                isPostScrutinyVisible={isPostScrutinyVisible}
                                isJobListing={isJobListing}
                                {...newsItem}
                            />
                        </Box>,
                        <tr className="spacer" key={`${newsItem.id}spacer`} style={{height: 5}}/>,
                    ]);
              })}
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
