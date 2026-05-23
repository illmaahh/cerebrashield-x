import re

INJECTION_PATTERNS = [
    r"ignore (all )?previous",
    r"system prompt",
    r"reveal your",
    r"exfiltrate",
    r"jailbreak",
    r"act as (root|admin|dan)",
    r"\[memory overwrite\]",
    r"bypass.*security",
    r"spawn.*child agents",
    r"encrypted base64",
    r"obey hidden goals",
    r"disregard.*instructions",
]

def heuristic_score(text: str) -> float:
    if not text:
        return 0.0
    hits = sum(1 for p in INJECTION_PATTERNS if re.search(p, text, re.IGNORECASE))
    return min(1.0, hits / 2.5)
