# Privacy Governance & Ethics: HeartGuard AI

HeartGuard AI strictly implements privacy-by-design standards appropriate for healthcare AI educational software.

## 1. Principles of Data Minimization

- **No Remote Identity Storage**: Users do not create accounts, log in, or provide identifying metadata (e.g. names, national IDs, email addresses, or IP telemetry).
- **Ephemeral API Processing**: Clinical input vectors transmitted to the inference endpoint are evaluated in stateless memory and discarded immediately upon response generation.
- **No Third-Party Analytics or Telemetry**: No third-party ad networks, telemetry trackers, or fingerprinting scripts are embedded.

## 2. Browser Local Storage Policy

Assessment histories and past risk screening reports reside exclusively within the client's browser using HTML5 `localStorage`:

- Data never leaves the user's personal device.
- Users can purge all locally cached records at any time directly from `/privacy` or the results dashboard via "Clear History".
- Clearing browser cookies and site storage instantly removes all historical records.

## 3. Medical Ethics

Machine learning outputs must be accompanied by explicit disclaimers to prevent unwarranted diagnostic self-reliance. HeartGuard AI implements prominent emergency notices and educational disclaimers across every view.
