# Step flx-05: Push to Airtable

**Agent**: lr-tracker
**Status**: open
**Epic**: sync-wgh (Flex Module Initialization)

## Objective

Distribute the generated social copy and media prompts to Airtable via a self-hosted n8n webhook.

## Process

1. **Construct Payload**:
   - `post_text`: [social_copy.txt]
   - `media_prompts`: [media_prompts.md]
   - `platform`: "LinkedIn"
   - `status`: "Draft"
2. **Post to Webhook**: Send JSON payload to `n8n_url`.
3. **Verify Staging**: Confirm receipt and store Airtable Record ID in MongoDB for tracking.

## Output

- Successfully staged post in Airtable.

## Next Step

- DONE
