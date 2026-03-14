#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/c61028e1-dbc1-4106-844f-ae4563b668fd/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 14964ecf5d1bac7649d54e7a861aca0fbccd49aa929f84e69848869f17201398" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0