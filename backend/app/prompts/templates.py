"""Prompt templates for itinerary generation."""

SYSTEM_PROMPT = """You are an expert travel planner with 20+ years of experience designing personalized itineraries.
Your recommendations are:
- Personalized based on user preferences (NOT generic)
- Time-optimized to minimize travel between locations
- Budget-conscious while maintaining quality experiences
- Considerate of travel pace and group dynamics
- Rich with specific venue names, addresses, and logistics details
- Practical with accurate timing and costs

You provide day-by-day itineraries with specific recommendations."""


def build_itinerary_prompt(
    destination: str,
    start_date: str,
    end_date: str,
    travel_style: str,
    interests: list[str],
    group_size: int,
    pace: str,
    budget_per_day: float,
    dietary_restrictions: list[str] = None,
    mobility_concerns: str = None,
) -> str:
    """Build the user prompt for itinerary generation."""

    dietary_info = f"Dietary restrictions: {', '.join(dietary_restrictions)}" if dietary_restrictions else ""
    mobility_info = f"Mobility considerations: {mobility_concerns}" if mobility_concerns else ""

    interests_str = ", ".join(interests)
    pace_description = {
        "relaxed": "one or two main activities per day with plenty of rest",
        "moderate": "two to three main activities per day with some downtime",
        "fast": "three to four main activities per day, constantly exploring",
    }.get(pace, "moderate pace")

    prompt = f"""Create a detailed {destination} itinerary from {start_date} to {end_date}.

USER PROFILE:
- Travel Style: {travel_style.capitalize()}
- Primary Interests: {interests_str}
- Group Size: {group_size} people(s)
- Daily Budget: ₹{budget_per_day} (INR)
- Pace: {pace} - {pace_description}
{dietary_info}
{mobility_info}

REQUIREMENTS:
1. Create a day-by-day itinerary matching these dates exactly
2. Each day should follow this structure:
   - Morning (specific venue name, address if possible, timing, cost)
   - Afternoon (specific venue name, address if possible, timing, cost)
   - Evening (specific venue name, address if possible, timing, cost)
   - Food recommendations (at least 2-3 specific restaurants for the travel style)
   - Accommodation info (general neighborhood recommendation for this type of trip)
   - Transport tips (specific transit info/costs)
   - Estimated daily cost in INR

3. Optimize for:
   - Geographic proximity (minimize travel time)
   - Budget constraints (all costs in INR - ₹)
   - {travel_style} traveler preferences
   - Safety and accessibility
   - Authentic local experiences (avoid tourist traps for {travel_style} travelers)

4. Provide SPECIFIC recommendations:
   - Use actual venue names, not generic "visit a museum"
   - Include realistic time estimates between locations
   - Consider {group_size}-person group dynamics
   - Address {travel_style} traveler concerns

5. Format each day as:
---
DAY [number]: [date]
Morning: [Venue Name] - [Specific activity] (Time: [estimated minutes], Cost: ₹[amount])
Afternoon: [Venue Name] - [Specific activity] (Time: [estimated minutes], Cost: ₹[amount])
Evening: [Venue Name] - [Specific activity] (Time: [estimated minutes], Cost: ₹[amount])
Food Recommendations: 
  - [Restaurant 1 Name] - [Cuisine type, budget estimate in ₹]
  - [Restaurant 2 Name] - [Cuisine type, budget estimate in ₹]
Accommodation Info: [Neighborhood recommendation and type for {travel_style} traveler]
Transport Tips: [Specific transit advice and costs in ₹]
Estimated Daily Cost: ₹[amount] (breakdown: activities + meals + transport)
---

Generate the complete itinerary now. Be specific, practical, and personalized. All monetary values must be in Indian Rupees (₹)."""

    return prompt


def get_rephrase_day_prompt(day: int, issues: str) -> str:
    """Create prompt to regenerate a single day."""
    return f"""Based on the previous itinerary for Day {day}, please regenerate that day's activities because: {issues}

Keep the same structure and format as before.
Focus on: specific venue names, times, costs in ₹, and logical geographic flow.
Maintain the same travel style and budget constraints (in INR)."""


def get_cost_optimization_prompt(destination: str, budget: float, current_itinerary: str) -> str:
    """Create prompt to optimize itinerary for budget."""
    return f"""Analyze this {destination} itinerary and optimize it to fit a ₹{budget} (INR) daily budget:

{current_itinerary}

Please suggest:
1. Alternative lower-cost activities (costs in ₹)
2. Money-saving tips specific to {destination}
3. Which activities to skip if necessary
4. Better restaurants options within budget
5. Revised daily cost breakdown (in ₹)

Format as a clear optimization report."""


SYSTEM_PROMPT_SHORT = """You are a travel expert. Generate specific, practical, personalized itineraries.
Use actual venue names and addresses. Consider budget, group size, and travel style.
Minimize generic recommendations."""
