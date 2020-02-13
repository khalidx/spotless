# spotless

For cleaning up your AWS account!

## running the cleanup

1) `npm install`
2) `chmod +x ./src/delete-everything.ts`
3) `./src/delete-everything.ts`

## features

- Currently Supported
  - delete all Lambda functions and function versions
  - delete all ENIs
- Coming Soon
  - delete all resources in an AWS account
  - resource exclusion filters
  - post-cleanup hooks
