# Resorak

Create an RSS feed for a Twitter account.

**Aggregates:**

TwitterRssFeed
TwitterRssFeed#getAll
TwitterRssFeed#create
TwitterRssFeed#delete

**Services:**

TwitterApiService
TwitterApiService#getUser
TwitterApiService#getTweetsFromUser

TwitterRssFeedFileCreator
TwitterRssFeedFileCreator#build
TwitterRssFeedFileCreator#save
TwitterRssFeedFileCreator#delete

TwitterRssFeedLocationsGenerator
TwitterRssFeedLocationsGenerator#generate

**Policies:**

TwitterRssFeedShouldNotExistPolicy
TwitterUserExistsPolicy
TwitterRssFeedDoesNotExistError

**Value objects:**

TwitterUser

TwitterUserId

TwitterUserName

TwitterUserDescription

TwitterUserThumbnail

Tweet

TwitterRssFeed

**Events:**

CREATED_RSS_EVENT

DELETED_RSS_EVENT

REGENERATED_RSS_EVENT
