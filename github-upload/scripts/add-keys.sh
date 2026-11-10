#!/bin/bash
# Asks for each key and saves it into .env.local.
# What you paste is hidden, and it's never shown or uploaded anywhere.
cd "$(dirname "$0")/.." || exit 1
touch .env.local

save() {
  local name="$1" value="$2"
  grep -v "^$name=" .env.local > .env.local.tmp
  printf '%s=%s\n' "$name" "$value" >> .env.local.tmp
  mv .env.local.tmp .env.local
}

ask() {
  local name="$1" hint="$2" value
  echo ""
  echo "$hint"
  read -r -s -p "Paste $name and press Return (or just Return to skip): " value
  echo ""
  value="$(printf '%s' "$value" | tr -d '[:space:]')"
  if [ -n "$value" ]; then save "$name" "$value"; echo "  ✓ $name saved"; else echo "  – skipped"; fi
}

ask DATABASE_URL      "Neon: project dashboard > Connect > copy the string starting with postgresql://"
ask ANTHROPIC_API_KEY "Anthropic: the key starting with sk-ant-"
ask STRIPE_SECRET_KEY "Stripe (test mode): Developers > API keys > Secret key starting with sk_test_"

echo ""
echo "Done. Tell Claude your keys are saved."
