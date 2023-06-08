/*
 *
 *   Licensed to the Apache Software Foundation (ASF) under one or more
 *   contributor license agreements.  See the NOTICE file distributed with
 *   this work for additional information regarding copyright ownership.
 *   The ASF licenses this file to You under the Apache License, Version 2.0
 *   (the "License"); you may not use this file except in compliance with
 *   the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import {getStatusCount} from "@/pages/Home/service";
import {Home} from "@/types/Home/data";

const JobStatusPie = () => {

  const [jobStatusData, setJobStatusData] = useState<Home.PieItem[]>([]);
  const [jobCount, setJobCount] = useState<number>(0);

  useEffect(() => {
    refreshStatusCount();
    let dataPolling = setInterval(refreshStatusCount, 15000);
    return () => {
      clearInterval(dataPolling);
    };
  }, []);

  const refreshStatusCount = () => {
    const res = getStatusCount();
    res.then((result) => {
      const statusCountData: Home.StatusCount = result.datas.instance;
      const newJobStatusData:Home.PieItem[] = [];
      for(const item in statusCountData){
        if(item==='all'){
          setJobCount(statusCountData[item]);
          continue;
        }
        if(statusCountData[item]===0){
          continue;
        }
        newJobStatusData.push({
          type: item,
          value: statusCountData[item],
        })
      }
      setJobStatusData(newJobStatusData);
    });
  };

  const config = {
    appendPadding: 10,
    data: jobStatusData,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    radius: 0.8,
    legend: false,
    label: {
      type: 'spider',
      labelHeight: 40,
      content: '{name}\n{value}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: {
        style: {
          fontSize: '16px',
        },
        customHtml: 'Job Instance',
      },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '24px',
        },
        content: jobCount,
      },
    },
  };
  return <div style={{height: '35vh'}}><Pie {...config} /></div>;
};

export default JobStatusPie