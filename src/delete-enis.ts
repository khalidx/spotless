#!/usr/bin/env ts-node

import { EC2 } from 'aws-sdk'

/** The AWS EC2 SDK */
const ec2 = new EC2()

/** This Lambda function deletes all ENIs */
export async function handler (event: any = {}, context: any = {}) {
  let enis = await listENIs()
  if (!event.delete) return response({ message: `Would have deleted ${enis.length} ENIs.` })
  let deleted = await Promise.all(enis.map(eni => ec2.deleteNetworkInterface({ NetworkInterfaceId: eni.NetworkInterfaceId! })))
  return response({ message: `Successfully deleted ${deleted.length} ENIs.` })
}

/** Lists all ENIs */
async function listENIs (marker?: string): Promise<EC2.NetworkInterfaceList> {
  let response = marker
    ? await ec2.describeNetworkInterfaces({ NextToken: marker }).promise()
    : await ec2.describeNetworkInterfaces().promise()
  if (response.NextToken) return (response.NetworkInterfaces || []).concat(await listENIs(response.NextToken))
  return response.NetworkInterfaces || []
}

/** Just a wrapper for logging before returning a response */
function response (something: any): any {
  console.log(something)
  return something
}

/** Lets us conveniently auto-run the handler when running locally */
if (!module.parent) handler()
