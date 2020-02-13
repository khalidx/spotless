#!/usr/bin/env ts-node

import { Lambda } from 'aws-sdk'

/** The AWS Lambda SDK */
const lambda = new Lambda()

/** This Lambda function deletes all other functions and versions, except itself and its versions */
export async function handler (event: any = {}, context: any = {}) {
  let functions = (await listFunctions()).filter(f => f.FunctionName !== context.functionName)
  if (!event.delete) return response({ message: `Would have deleted ${functions.length} Lambda functions and function versions.` })
  let deleted = await Promise.all(functions.map(f => lambda.deleteFunction({ FunctionName: f.FunctionName!, Qualifier: f.Version })))
  return response({ message: `Successfully deleted ${deleted.length} Lambda functions and function versions.` })
}

/** Lists all Lambda functions and function versions */
async function listFunctions (marker?: string): Promise<Lambda.FunctionList> {
  let response = marker
    ? await lambda.listFunctions({ FunctionVersion: 'ALL', Marker: marker }).promise()
    : await lambda.listFunctions({ FunctionVersion: 'ALL' }).promise()
  if (response.NextMarker) return (response.Functions || []).concat(await listFunctions(response.NextMarker))
  return response.Functions || []
}

/** Just a wrapper for logging before returning a response */
function response (something: any): any {
  console.log(something)
  return something
}

/** Lets us conveniently auto-run the handler when running locally */
if (!module.parent) handler()
