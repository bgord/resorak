# Resorak

Create an RSS feed for a Twitter account.

**Aggregates:**

TwitterRssFeed
TwitterRssFeed#getAll
TwitterRssFeed#create
TwitterRssFeed#delete

TwitterRssFeedLocationsGenerator
TwitterRssFeedLocationsGenerator#generate

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
