CORRECT_MARKS = 4
WRONG_MARKS = -1
SUBJECTS = ("botany", "zoology")


def evaluate(questions: list[dict], answers: dict[str, int]) -> dict:
    details = []
    by_subject = {subject: {"attempted": 0, "correct": 0} for subject in SUBJECTS}

    for question in questions:
        selected = answers.get(question["_id"])
        is_answered = selected is not None
        is_correct = is_answered and selected == question["correct_index"]

        details.append(
            {
                "question": question,
                "selected_index": selected,
                "is_answered": is_answered,
                "is_correct": is_correct,
            }
        )

        if is_answered:
            by_subject[question["subject"]]["attempted"] += 1
            by_subject[question["subject"]]["correct"] += int(is_correct)

    total = len(questions)
    correct = sum(1 for detail in details if detail["is_correct"])
    attempted = sum(1 for detail in details if detail["is_answered"])
    wrong = attempted - correct

    return {
        "details": details,
        "total": total,
        "attempted": attempted,
        "correct": correct,
        "wrong": wrong,
        "skipped": total - attempted,
        "score": correct * CORRECT_MARKS + wrong * WRONG_MARKS,
        "max_score": total * CORRECT_MARKS,
        "accuracy": round(correct / total * 100) if total else 0,
        "by_subject": by_subject,
    }