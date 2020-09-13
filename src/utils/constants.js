export function getLastCampaigns() {
  return [
    {
      name: 'test-test-test2-test',
      companyName: 'Keepnet Labs',
      itemId: 69770001,
      mailCount: 15,
      sendCount: 15,
      finishDate: '2020-08-11T10:17:55.137',
      startDate: '2020-08-07T16:09:45.33',
      status: 2,
      campaignDate: '2020-08-07T16:09:36.63',
      campaignId: 'be394c6e-335d-4d71-900b-a2c5a32678ca',
      companyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
      readCount: 0,
      notResponse: 15,
      clickedCount: 0,
      capturedCount: 0
    },
    {
      name: 'test-SQL-process',
      companyName: 'Keepnet Labs',
      itemId: 69760001,
      mailCount: 202,
      sendCount: 202,
      finishDate: '2020-05-07T12:19:44.393',
      startDate: '2020-05-07T11:08:34.007',
      status: 2,
      campaignDate: '2020-05-07T11:06:37.21',
      campaignId: 'c51c55e3-7ead-4e92-95fa-5643c6a7b051',
      companyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
      readCount: 0,
      notResponse: 202,
      clickedCount: 0,
      capturedCount: 0
    },
    {
      name: 'test-05070',
      companyName: 'Keepnet Labs',
      itemId: 69750001,
      mailCount: 202,
      sendCount: 202,
      finishDate: '2020-05-07T11:48:25.447',
      startDate: '2020-05-07T10:36:48.433',
      status: 2,
      campaignDate: '2020-05-07T10:35:32.77',
      campaignId: '813d4d1b-a61f-4fca-be66-a931b9d9eaa1',
      companyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
      readCount: 0,
      notResponse: 202,
      clickedCount: 0,
      capturedCount: 0
    },
    {
      name: 'okan0506',
      companyName: 'Keepnet Labs',
      itemId: 69740001,
      mailCount: 202,
      sendCount: 202,
      finishDate: '2020-05-06T19:43:55.043',
      startDate: '2020-05-06T18:29:39.163',
      status: 2,
      campaignDate: '2020-05-06T17:17:26.12',
      campaignId: 'a1c29586-9ee9-4412-b44e-3ba7c3873698',
      companyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
      readCount: 0,
      notResponse: 202,
      clickedCount: 0,
      capturedCount: 0
    },
    {
      name: 'bilal randomize test %0',
      companyName: 'Keepnet Labs',
      itemId: 69700001,
      mailCount: 4,
      sendCount: 4,
      finishDate: '2020-04-24T00:11:32.487',
      startDate: '2020-04-20T05:35:11.98',
      status: 2,
      campaignDate: '2020-04-20T05:33:09.287',
      campaignId: 'a7fff92e-4371-4d1c-8562-2ad084873212',
      companyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
      readCount: 0,
      notResponse: 4,
      clickedCount: 0,
      capturedCount: 0
    }
  ]
}

export function getCampaignSummary() {
  return [
    {
      campaignCount: 3,
      color: '#e91e63',
      description: 'Canceled',
      status: 0
    },
    {
      campaignCount: 302,
      color: '#66bb6a',
      description: 'Completed',
      status: 4
    },
    {
      campaignCount: 37,
      color: '#00bcd4',
      description: 'Idle',
      status: 1
    },
    {
      campaignCount: 70,
      color: '#C7F0E5',
      description: 'Passive',
      status: 5
    },
    {
      campaignCount: 3,
      color: '#2196f3',
      description: 'Running',
      status: 3
    }
  ]
}

export function getCompanyInformation() {
  return {
    companyName: 'Keepnet Labs',
    campaignCount: 0,
    createDate: '2017-09-23T21:52:11.76',
    limits: 48411,
    pLimite: 'Yearly',
    userCount: 43,
    sentMailLimit: 0,
    totalSentMail: 18763,
    score: '94'
  }
}

export function getCompanyOverallScore() {
  return {
    phishingSimulatorScore: [
      100.0,
      98.75,
      0.0,
      0.0,
      100.0,
      99.86,
      100.0,
      0.0,
      100.0,
      0.0,
      0.0,
      100.0
    ],
    awarenessEducatorScore: [
      1370.0,
      70.54,
      0.0,
      0.0,
      0.0,
      22.87,
      14.82,
      13.08,
      64.74,
      5.88,
      1.05,
      10.44
    ],
    threatIntelligence: [0.0, 0.0, 0.0, 0.0, 5272.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    incidentResponder: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 12.0, 25.0, 0.0, 0.0],
    emailThreatSimulator: null
  }
}
