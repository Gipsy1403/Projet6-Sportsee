const { dataMocks } = require("@/src/mocks/users");

export function dateAndDistanceExtraction(){
	return dataMocks[0].runningData.map(activity=>({
		date:activity.date,
		distance : activity.distance
	}));
}

export function extractionBpm(){
	const activities=dataMocks[0].runningData;
	const bpmData = activities.map(activity => ({
	date: activity.date,
	min: activity.heartRate.min,
	max: activity.heartRate.max,
	average: activity.heartRate.average,
	}));

	return bpmData
}

export function extractionWeeklyGoal(){
	const activities=dataMocks[0].runningData;
	const objective = dataMocks[0].weeklyGoal;
	const weekObjective=
	activities.map(activity => ({
	date: activity.date,
	objective:objective
	}));

	return weekObjective
}
