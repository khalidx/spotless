#!/usr/bin/env ts-node

import { handler as deleteLambdaFunctions } from './delete-lambda-functions'
import { handler as deleteEnis } from './delete-enis'

/** This Lambda function deletes everything (that isn't excluded) from an AWS account */
export async function handler (event: any = {}, context: any = {}) {
  await deleteLambdaFunctions(event, context)
  await deleteEnis(event, context)
}

/** Lets us conveniently auto-run the handler when running locally */
if (!module.parent) handler()
