import { scrapeCourseData, CourseHeader } from "~content";

export interface ShowCourseTabPayload {
  header: CourseHeader;
  professors: string[];
}

// State vars
let courseTabId: number = null;
let scrapedCourseData: ShowCourseTabPayload = null;

/** Injects the content script if we hit a course page */
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (/^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/courses\/.+$/.test(
      details.url
  )) 
  {
    chrome.scripting.executeScript({
        target: {
            tabId: details.tabId,
        },
        world: "MAIN",
        // content script injection only works reliably on the prod packaged extension
        // b/c of the plasmo dev server connections
        func: scrapeCourseData,
    }, function (resolve) {
      if (resolve && resolve[0] && resolve[0].result) {
        const result: ShowCourseTabPayload = resolve[0].result;
        scrapedCourseData = result;
      };
    });
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
    courseTabId = details.tabId
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});

/** Sets the icon to be active if we're on a course tab */
chrome.tabs.onActivated.addListener(details => {
  if (details.tabId == courseTabId) {
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});

export function getScrapedCourseData() {
  return scrapedCourseData;
}