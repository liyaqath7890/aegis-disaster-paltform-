export function planDroneSurveyRoute(origin, targets = []) {
  return {
    origin,
    waypoints: targets.map((target, index) => ({
      ...target,
      sequence: index + 1,
      action: 'survey'
    }))
  };
}
