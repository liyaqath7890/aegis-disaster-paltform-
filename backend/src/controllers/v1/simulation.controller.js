import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { detectPanicKeywords, simulateDisasterPrediction } from '../../ai/prediction.service.js';
import { planDroneSurveyRoute } from '../../drone/drone.service.js';

export const getAiPrediction = asyncHandler(async (req, res) => {
  const prediction = await simulateDisasterPrediction({
    rainfallMm: req.query.rainfallMm ? Number(req.query.rainfallMm) : undefined,
    windSpeedKmph: req.query.windSpeedKmph ? Number(req.query.windSpeedKmph) : undefined,
    seismicIndex: Number(req.query.seismicIndex || 1.2),
    lat: req.query.lat,
    lng: req.query.lng
  });
  sendSuccess(res, prediction, 'AI prediction simulation complete');
});

export const getDroneMission = asyncHandler(async (_req, res) => {
  const mission = planDroneSurveyRoute(
    { lat: 19.076, lng: 72.8777, label: 'North depot' },
    [
      { lat: 19.0902, lng: 72.8678, label: 'Flood grid A' },
      { lat: 19.0821, lng: 72.8812, label: 'Shelter scan' },
      { lat: 19.071, lng: 72.889, label: 'Return corridor' }
    ]
  );
  sendSuccess(res, { ...mission, battery: 78, altitudeMeters: 120, signal: 'strong' }, 'Drone simulation loaded');
});

export const postPanicDetection = asyncHandler(async (req, res) => {
  sendSuccess(res, detectPanicKeywords(req.body.text), 'Panic keyword simulation complete');
});
