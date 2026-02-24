#include <math.h>

typedef struct {
  int points;
  int affinity;
  double streak_multiplier;
  double mode_multiplier;
  int qualified;
} Reward;

static double streak_multiplier(int streak) {
  if (streak >= 7) return 1.3;
  if (streak >= 4) return 1.2;
  return 1.0;
}

Reward calc_reward(int elapsed_sec, int is_deep_mode, int streak) {
  Reward r = {0, 0, streak_multiplier(streak), is_deep_mode ? 1.1 : 1.0, 0};
  if (elapsed_sec < 1500) return r;

  int base = (elapsed_sec / 1500) * 10;
  double total = base * r.streak_multiplier * r.mode_multiplier;
  r.points = (int)floor(total);
  r.affinity = (int)floor(total);
  r.qualified = 1;
  return r;
}
