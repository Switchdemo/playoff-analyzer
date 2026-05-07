import { useState, useCallback, useEffect } from "react";

// ─── PLAYER DATA (Underdog Fantasy lines, sourced May 6-7 2026) ───────────────
const PLAYERS_DATA = {
  "Jalen Brunson":           { team:"NYK", pos:"G", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:33.5,reb:4.5,ast:8.5,pra:46.5}, stats:[{pts:38,reb:4,ast:9,pra:51,g:"G2 vs PHI"},{pts:42,reb:3,ast:7,pra:52,g:"G1 vs PHI"},{pts:31,reb:4,ast:8,pra:43,g:"G6 vs ATL"},{pts:29,reb:5,ast:10,pra:44,g:"G5 vs ATL"},{pts:33,reb:3,ast:7,pra:43,g:"G4 vs ATL"}], ctx:"ON FIRE — avg 40 PPG this series vs PHI. NYK leads 2-0" },
  "OG Anunoby":              { team:"NYK", pos:"F", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:18.5,reb:6.5,ast:2.5,pra:27.5}, stats:[{pts:18,reb:3,ast:2,pra:23,g:"G2 vs PHI"},{pts:18,reb:3,ast:1,pra:22,g:"G1 vs PHI"},{pts:24,reb:9,ast:3,pra:36,g:"G6 vs ATL"},{pts:21,reb:8,ast:2,pra:31,g:"G5 vs ATL"},{pts:19,reb:7,ast:3,pra:29,g:"G4 vs ATL"}], ctx:"Avg 21 pts & 7.9 reb in playoffs. Blowout G1 limited mins — full game in G3" },
  "Julius Randle":           { team:"NYK", pos:"F", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:20.5,reb:9.5,ast:5.5,pra:35.5}, stats:[{pts:22,reb:9,ast:5,pra:36,g:"G2 vs PHI"},{pts:26,reb:11,ast:6,pra:43,g:"G1 vs PHI"},{pts:19,reb:10,ast:4,pra:33,g:"G6 vs ATL"},{pts:23,reb:8,ast:5,pra:36,g:"G5 vs ATL"},{pts:18,reb:12,ast:3,pra:33,g:"G4 vs ATL"}], ctx:"2 triple-doubles vs ATL. Assists avg 4.6 this series" },
  "Karl-Anthony Towns":      { team:"NYK", pos:"C", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:22.5,reb:9.5,ast:5.5,pra:37.5}, stats:[{pts:24,reb:8,ast:5,pra:37,g:"G2 vs PHI"},{pts:28,reb:9,ast:7,pra:44,g:"G1 vs PHI"},{pts:22,reb:10,ast:6,pra:38,g:"G6 vs ATL"},{pts:19,reb:11,ast:5,pra:35,g:"G5 vs ATL"},{pts:26,reb:12,ast:8,pra:46,g:"G4 vs ATL"}], ctx:"Averaged 6.2 ast in last 10. Embiid OUT means less foul trouble" },
  "Josh Hart":               { team:"NYK", pos:"G-F", opp:"PHI", game:"phi-nyk", injury:null, lines:{pts:10.5,reb:9.5,ast:3.5,pra:23.5}, stats:[{pts:11,reb:8,ast:4,pra:23,g:"G2 vs PHI"},{pts:13,reb:12,ast:5,pra:30,g:"G1 vs PHI"},{pts:10,reb:11,ast:3,pra:24,g:"G6 vs ATL"},{pts:12,reb:9,ast:4,pra:25,g:"G5 vs ATL"},{pts:8,reb:10,ast:3,pra:21,g:"G4 vs ATL"}], ctx:"Had 8 reb in G1 in only 26 min; more boards expected in full competitive game" },
  "Mikal Bridges":           { team:"NYK", pos:"F", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:14.5,reb:4.5,ast:2.5,pra:21.5}, stats:[{pts:16,reb:4,ast:3,pra:23,g:"G2 vs PHI"},{pts:14,reb:3,ast:2,pra:19,g:"G1 vs PHI"},{pts:18,reb:5,ast:4,pra:27,g:"G6 vs ATL"},{pts:15,reb:4,ast:3,pra:22,g:"G5 vs ATL"},{pts:13,reb:6,ast:2,pra:21,g:"G4 vs ATL"}], ctx:"Consistent role player; full minutes expected" },
  "Tyrese Maxey":            { team:"PHI", pos:"G", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:24.5,reb:3.5,ast:5.5,pra:33.5}, stats:[{pts:21,reb:3,ast:5,pra:29,g:"G2 vs NYK"},{pts:24,reb:4,ast:6,pra:34,g:"G1 vs NYK"},{pts:29,reb:3,ast:7,pra:39,g:"G7 vs BOS"},{pts:32,reb:4,ast:5,pra:41,g:"G6 vs BOS"},{pts:21,reb:3,ast:6,pra:30,g:"G5 vs BOS"}], ctx:"Hit OVER 24.5 pts in 3/4 reg-season NYK games. Embiid OUT = massive usage boost" },
  "Joel Embiid":             { team:"PHI", pos:"C", opp:"NYK", game:"phi-nyk", injury:"⚠️ OUT — Hip/Ankle (G3)", lines:{pts:27.5,reb:10.5,ast:4.5,pra:42.5}, stats:[{pts:24,reb:9,ast:3,pra:36,g:"G2 vs NYK"},{pts:28,reb:11,ast:4,pra:43,g:"G1 vs NYK"},{pts:31,reb:10,ast:5,pra:46,g:"G7 vs BOS"},{pts:35,reb:12,ast:3,pra:50,g:"G6 vs BOS"},{pts:27,reb:8,ast:4,pra:39,g:"G5 vs BOS"}], ctx:"🚫 RULED OUT — props OFF the board" },
  "Paul George":             { team:"PHI", pos:"F", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:18.5,reb:5.5,ast:3.5,pra:27.5}, stats:[{pts:19,reb:5,ast:4,pra:28,g:"G2 vs NYK"},{pts:16,reb:6,ast:3,pra:25,g:"G1 vs NYK"},{pts:22,reb:7,ast:4,pra:33,g:"G7 vs BOS"},{pts:24,reb:6,ast:5,pra:35,g:"G6 vs BOS"},{pts:18,reb:5,ast:3,pra:26,g:"G5 vs BOS"}], ctx:"Primary scorer with Embiid OUT — usage spikes significantly" },
  "James Harden":            { team:"PHI", pos:"G", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:18.5,reb:5.5,ast:8.5,pra:32.5}, stats:[{pts:18,reb:5,ast:9,pra:32,g:"G2 vs NYK"},{pts:14,reb:4,ast:8,pra:26,g:"G1 vs NYK"},{pts:22,reb:6,ast:10,pra:38,g:"G7 vs BOS"},{pts:24,reb:5,ast:9,pra:38,g:"G6 vs BOS"},{pts:16,reb:4,ast:8,pra:28,g:"G5 vs BOS"}], ctx:"PRA model projects 37 avg — 32.5 line is near his floor. Assists soft at 8.5" },
  "Kelly Oubre Jr.":         { team:"PHI", pos:"F", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:10.5,reb:3.5,ast:1.5,pra:15.5}, stats:[{pts:12,reb:4,ast:1,pra:17,g:"G2 vs NYK"},{pts:8,reb:3,ast:2,pra:13,g:"G1 vs NYK"},{pts:14,reb:5,ast:2,pra:21,g:"G7 vs BOS"},{pts:11,reb:4,ast:1,pra:16,g:"G6 vs BOS"},{pts:9,reb:3,ast:1,pra:13,g:"G5 vs BOS"}], ctx:"Expanded role with Embiid out" },
  "Cade Cunningham":         { team:"DET", pos:"G", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:27.5,reb:5.5,ast:9.5,pra:42.5}, stats:[{pts:28,reb:5,ast:9,pra:42,g:"G1 vs CLE"},{pts:31,reb:6,ast:11,pra:48,g:"G7 vs ORL"},{pts:26,reb:4,ast:8,pra:38,g:"G6 vs ORL"},{pts:24,reb:5,ast:9,pra:38,g:"G5 vs ORL"},{pts:29,reb:7,ast:10,pra:46,g:"G4 vs ORL"}], ctx:"27.6 pts avg in playoffs. CLE pushed back hard in G1" },
  "Ausar Thompson":          { team:"DET", pos:"F", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:13.5,reb:10.5,ast:5.5,pra:29.5}, stats:[{pts:16,reb:10,ast:5,pra:31,g:"G1 vs CLE"},{pts:15,reb:15,ast:6,pra:36,g:"G7 vs ORL"},{pts:10,reb:10,ast:6,pra:26,g:"G6 vs ORL"},{pts:12,reb:15,ast:6,pra:33,g:"G5 vs ORL"},{pts:14,reb:12,ast:5,pra:31,g:"G4 vs ORL"}], ctx:"15 & 10 reb G6/G7 + 12 combined ast+blk+stl. Athleticism elite" },
  "Jalen Duren":             { team:"DET", pos:"C", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:13.5,reb:11.5,ast:2.5,pra:27.5}, stats:[{pts:14,reb:12,ast:2,pra:28,g:"G1 vs CLE"},{pts:18,reb:14,ast:3,pra:35,g:"G7 vs ORL"},{pts:12,reb:10,ast:2,pra:24,g:"G6 vs ORL"},{pts:16,reb:13,ast:1,pra:30,g:"G5 vs ORL"},{pts:10,reb:11,ast:2,pra:23,g:"G4 vs ORL"}], ctx:"Hit reb OVER in 4 of last 5. Double-double machine" },
  "Malik Beasley":           { team:"DET", pos:"G", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:13.5,reb:2.5,ast:1.5,pra:17.5}, stats:[{pts:14,reb:3,ast:2,pra:19,g:"G1 vs CLE"},{pts:18,reb:2,ast:1,pra:21,g:"G7 vs ORL"},{pts:12,reb:3,ast:2,pra:17,g:"G6 vs ORL"},{pts:16,reb:2,ast:1,pra:19,g:"G5 vs ORL"},{pts:11,reb:3,ast:2,pra:16,g:"G4 vs ORL"}], ctx:"Hot shooter, DET floor spacer" },
  "Tim Hardaway Jr.":        { team:"DET", pos:"G-F", opp:"CLE", game:"det-cle", injury:null, lines:{pts:12.5,reb:2.5,ast:1.5,pra:16.5}, stats:[{pts:13,reb:3,ast:2,pra:18,g:"G1 vs CLE"},{pts:11,reb:2,ast:1,pra:14,g:"G7 vs ORL"},{pts:16,reb:4,ast:2,pra:22,g:"G6 vs ORL"},{pts:9,reb:2,ast:2,pra:13,g:"G5 vs ORL"},{pts:14,reb:3,ast:1,pra:18,g:"G4 vs ORL"}], ctx:"Streaky scorer" },
  "Tobias Harris":           { team:"DET", pos:"F", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:11.5,reb:5.5,ast:2.5,pra:19.5}, stats:[{pts:12,reb:5,ast:2,pra:19,g:"G1 vs CLE"},{pts:14,reb:7,ast:3,pra:24,g:"G7 vs ORL"},{pts:10,reb:6,ast:2,pra:18,g:"G6 vs ORL"},{pts:13,reb:5,ast:2,pra:20,g:"G5 vs ORL"},{pts:9,reb:4,ast:2,pra:15,g:"G4 vs ORL"}], ctx:"High-floor veteran" },
  "Donovan Mitchell":        { team:"CLE", pos:"G", opp:"DET", game:"det-cle", injury:null,  lines:{pts:28.5,reb:4.5,ast:6.5,pra:39.5}, stats:[{pts:28,reb:4,ast:6,pra:38,g:"G1 vs DET"},{pts:33,reb:5,ast:7,pra:45,g:"G7 vs TOR"},{pts:31,reb:4,ast:8,pra:43,g:"G6 vs TOR"},{pts:24,reb:6,ast:5,pra:35,g:"G5 vs TOR"},{pts:36,reb:3,ast:6,pra:45,g:"G4 vs TOR"}], ctx:"30+ PPG in playoffs. CLE must bounce back down 0-1" },
  "James Harden (CLE)":      { team:"CLE", pos:"G", opp:"DET", game:"det-cle", injury:null,  lines:{pts:18.5,reb:6.5,ast:9.5,pra:34.5}, stats:[{pts:18,reb:6,ast:10,pra:34,g:"G1 vs DET"},{pts:22,reb:5,ast:9,pra:36,g:"G7 vs TOR"},{pts:19,reb:4,ast:11,pra:34,g:"G6 vs TOR"},{pts:16,reb:6,ast:8,pra:30,g:"G5 vs TOR"},{pts:24,reb:5,ast:10,pra:39,g:"G4 vs TOR"}], ctx:"Model projects 37 PRA avg. Line at his floor. Heavy minutes" },
  "Darius Garland":          { team:"CLE", pos:"G", opp:"DET", game:"det-cle", injury:null,  lines:{pts:20.5,reb:3.5,ast:8.5,pra:32.5}, stats:[{pts:22,reb:3,ast:8,pra:33,g:"G1 vs DET"},{pts:26,reb:4,ast:9,pra:39,g:"G7 vs TOR"},{pts:19,reb:3,ast:7,pra:29,g:"G6 vs TOR"},{pts:24,reb:2,ast:10,pra:36,g:"G5 vs TOR"},{pts:21,reb:4,ast:8,pra:33,g:"G4 vs TOR"}], ctx:"8+ assists in 4 of last 5. Strong distributor" },
  "Evan Mobley":             { team:"CLE", pos:"F-C", opp:"DET", game:"det-cle", injury:null, lines:{pts:16.5,reb:9.5,ast:3.5,pra:29.5}, stats:[{pts:16,reb:9,ast:3,pra:28,g:"G1 vs DET"},{pts:19,reb:11,ast:4,pra:34,g:"G7 vs TOR"},{pts:14,reb:10,ast:2,pra:26,g:"G6 vs TOR"},{pts:18,reb:8,ast:3,pra:29,g:"G5 vs TOR"},{pts:22,reb:12,ast:3,pra:37,g:"G4 vs TOR"}], ctx:"Reb OVER in 4 of 5. Key frontcourt vs Duren" },
  "Georges Niang":           { team:"CLE", pos:"F", opp:"DET", game:"det-cle", injury:null,  lines:{pts:8.5,reb:3.5,ast:1.5,pra:13.5}, stats:[{pts:9,reb:3,ast:2,pra:14,g:"G1 vs DET"},{pts:12,reb:4,ast:1,pra:17,g:"G7 vs TOR"},{pts:8,reb:2,ast:2,pra:12,g:"G6 vs TOR"},{pts:11,reb:3,ast:1,pra:15,g:"G5 vs TOR"},{pts:7,reb:2,ast:2,pra:11,g:"G4 vs TOR"}], ctx:"3-pt specialist, crunch time value" },
  "Jarrett Allen":           { team:"CLE", pos:"C", opp:"DET", game:"det-cle", injury:null,  lines:{pts:10.5,reb:9.5,ast:2.5,pra:22.5}, stats:[{pts:11,reb:10,ast:2,pra:23,g:"G1 vs DET"},{pts:14,reb:12,ast:3,pra:29,g:"G7 vs TOR"},{pts:9,reb:9,ast:1,pra:19,g:"G6 vs TOR"},{pts:12,reb:11,ast:2,pra:25,g:"G5 vs TOR"},{pts:8,reb:8,ast:1,pra:17,g:"G4 vs TOR"}], ctx:"Double-double candidate vs Duren battle" },
  "Victor Wembanyama":       { team:"SAS", pos:"C", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:21.5,reb:11.5,ast:3.5,pra:36.5,blk:4.5}, stats:[{pts:11,reb:15,ast:2,pra:28,blk:12,g:"G1 vs MIN (12 blk record)"},{pts:29,reb:14,ast:3,pra:46,blk:4,g:"G5 vs POR"},{pts:33,reb:10,ast:6,pra:49,blk:3,g:"G4 vs POR"},{pts:27,reb:9,ast:5,pra:41,blk:6,g:"G3 vs POR"},{pts:31,reb:12,ast:4,pra:47,blk:4,g:"G2 vs POR"}], ctx:"Set postseason blk record (12) in G1 but only 11 pts. Model: UNDER 4.5 blk G2. G2 halfime: 14 pts" },
  "De'Aaron Fox":            { team:"SAS", pos:"G", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:22.5,reb:3.5,ast:6.5,pra:32.5}, stats:[{pts:28,reb:3,ast:8,pra:39,g:"G1 vs MIN"},{pts:24,reb:4,ast:6,pra:34,g:"G5 vs POR"},{pts:31,reb:2,ast:9,pra:42,g:"G4 vs POR"},{pts:22,reb:3,ast:7,pra:32,g:"G3 vs POR"},{pts:20,reb:4,ast:5,pra:29,g:"G2 vs POR"}], ctx:"G2 halftime: 14 pts on 50% FG. SAS up 24+ at half" },
  "Stephon Castle":          { team:"SAS", pos:"G", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:14.5,reb:3.5,ast:3.5,pra:21.5}, stats:[{pts:18,reb:4,ast:4,pra:26,g:"G1 vs MIN"},{pts:14,reb:3,ast:3,pra:20,g:"G5 vs POR"},{pts:16,reb:5,ast:4,pra:25,g:"G4 vs POR"},{pts:12,reb:3,ast:3,pra:18,g:"G3 vs POR"},{pts:15,reb:4,ast:3,pra:22,g:"G2 vs POR"}], ctx:"G2 halftime: 12 pts on 50% FG — on pace for OVER" },
  "Dylan Harper":            { team:"SAS", pos:"G", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:14.5,reb:4.5,ast:2.5,pra:21.5}, stats:[{pts:17,reb:5,ast:3,pra:25,g:"G1 vs MIN"},{pts:19,reb:4,ast:2,pra:25,g:"G5 vs POR"},{pts:15,reb:5,ast:3,pra:23,g:"G4 vs POR"},{pts:13,reb:4,ast:2,pra:19,g:"G3 vs POR"},{pts:17,reb:3,ast:3,pra:23,g:"G2 vs POR"}], ctx:"Back-to-back 17+ pt games. Averaging 16.3 pts last 4 playoff games" },
  "Devin Vassell":           { team:"SAS", pos:"F", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:13.5,reb:3.5,ast:2.5,pra:19.5,blk:0.5}, stats:[{pts:14,reb:4,ast:3,pra:21,g:"G1 vs MIN"},{pts:18,reb:5,ast:2,pra:25,g:"G5 vs POR"},{pts:12,reb:3,ast:2,pra:17,g:"G4 vs POR"},{pts:16,reb:4,ast:3,pra:23,g:"G3 vs POR"},{pts:11,reb:4,ast:2,pra:17,g:"G2 vs POR"}], ctx:"3/6 threes G1. MIN allows fewest 3PM/game in NBA (11.9) — UNDER 2.5 threes angle" },
  "Keldon Johnson":          { team:"SAS", pos:"F-G", opp:"MIN", game:"sas-min", injury:null, lines:{pts:10.5,reb:4.5,ast:1.5,pra:16.5}, stats:[{pts:12,reb:5,ast:2,pra:19,g:"G1 vs MIN"},{pts:10,reb:4,ast:1,pra:15,g:"G5 vs POR"},{pts:14,reb:6,ast:2,pra:22,g:"G4 vs POR"},{pts:9,reb:3,ast:1,pra:13,g:"G3 vs POR"},{pts:11,reb:5,ast:2,pra:18,g:"G2 vs POR"}], ctx:"G2 halftime: 6 pts 5 reb — on pace. Versatile wing" },
  "Luke Kornet":             { team:"SAS", pos:"C-F", opp:"MIN", game:"sas-min", injury:null, lines:{pts:7.5,reb:4.5,ast:1.5,pra:13.5}, stats:[{pts:8,reb:5,ast:2,pra:15,g:"G1 vs MIN"},{pts:6,reb:4,ast:1,pra:11,g:"G5 vs POR"},{pts:9,reb:5,ast:2,pra:16,g:"G4 vs POR"},{pts:7,reb:3,ast:1,pra:11,g:"G3 vs POR"},{pts:5,reb:4,ast:1,pra:10,g:"G2 vs POR"}], ctx:"Rim-runner; G2 live: 2 pts 3 reb 2 stl at half" },
  "Anthony Edwards":         { team:"MIN", pos:"G", opp:"SAS", game:"sas-min", injury:"⚠️ Ankle (Limited)", lines:{pts:24.5,reb:3.5,ast:4.5,pra:32.5}, stats:[{pts:18,reb:3,ast:3,pra:24,g:"G1 vs SAS (25 min)"},{pts:36,reb:6,ast:5,pra:47,g:"G6 vs DEN"},{pts:28,reb:4,ast:6,pra:38,g:"G5 vs DEN"},{pts:22,reb:5,ast:3,pra:30,g:"G4 vs DEN"},{pts:33,reb:7,ast:4,pra:44,g:"G3 vs DEN"}], ctx:"Ankle limited — 25 min off bench G1. UNDER reb (3.5) strong play" },
  "Julius Randle (MIN)":     { team:"MIN", pos:"F", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:19.5,reb:7.5,ast:4.5,pra:31.5}, stats:[{pts:20,reb:8,ast:4,pra:32,g:"G1 vs SAS"},{pts:24,reb:9,ast:5,pra:38,g:"G6 vs DEN"},{pts:18,reb:7,ast:4,pra:29,g:"G5 vs DEN"},{pts:22,reb:8,ast:5,pra:35,g:"G4 vs DEN"},{pts:19,reb:10,ast:3,pra:32,g:"G3 vs DEN"}], ctx:"Primary frontcourt scorer with Edwards limited" },
  "Rudy Gobert":             { team:"MIN", pos:"C", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:10.5,reb:12.5,ast:2.5,pra:25.5}, stats:[{pts:10,reb:12,ast:2,pra:24,g:"G1 vs SAS"},{pts:14,reb:15,ast:2,pra:31,g:"G6 vs DEN"},{pts:12,reb:13,ast:1,pra:26,g:"G5 vs DEN"},{pts:8,reb:11,ast:2,pra:21,g:"G4 vs DEN"},{pts:10,reb:14,ast:1,pra:25,g:"G3 vs DEN"}], ctx:"G2 live: 4 pts 7 reb at half — on pace for OVER. Double-double in 4 of 5" },
  "Naz Reid":                { team:"MIN", pos:"C-F", opp:"SAS", game:"sas-min", injury:null, lines:{pts:13.5,reb:7.5,ast:2.5,pra:23.5}, stats:[{pts:14,reb:7,ast:2,pra:23,g:"G1 vs SAS"},{pts:18,reb:8,ast:3,pra:29,g:"G6 vs DEN"},{pts:12,reb:6,ast:2,pra:20,g:"G5 vs DEN"},{pts:16,reb:9,ast:2,pra:27,g:"G4 vs DEN"},{pts:10,reb:6,ast:1,pra:17,g:"G3 vs DEN"}], ctx:"G2 live: 5 pts 5 reb at half. Key bench scorer" },
  "Mike Conley":             { team:"MIN", pos:"G", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:8.5,reb:3.5,ast:6.5,pra:18.5}, stats:[{pts:8,reb:3,ast:7,pra:18,g:"G1 vs SAS"},{pts:12,reb:4,ast:8,pra:24,g:"G6 vs DEN"},{pts:9,reb:2,ast:6,pra:17,g:"G5 vs DEN"},{pts:11,reb:3,ast:7,pra:21,g:"G4 vs DEN"},{pts:7,reb:2,ast:5,pra:14,g:"G3 vs DEN"}], ctx:"Hit assists OVER in 4 of 5. Floor general value" },
  "Jaden McDaniels":         { team:"MIN", pos:"F", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:12.5,reb:4.5,ast:2.5,pra:19.5}, stats:[{pts:14,reb:5,ast:3,pra:22,g:"G1 vs SAS"},{pts:16,reb:4,ast:2,pra:22,g:"G6 vs DEN"},{pts:12,reb:3,ast:3,pra:18,g:"G5 vs DEN"},{pts:14,reb:5,ast:2,pra:21,g:"G4 vs DEN"},{pts:10,reb:4,ast:2,pra:16,g:"G3 vs DEN"}], ctx:"Key perimeter defender on Fox/Wemby" },
  "Terrence Shannon Jr.":    { team:"MIN", pos:"G", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:9.5,reb:3.5,ast:2.5,pra:15.5}, stats:[{pts:8,reb:3,ast:2,pra:13,g:"G1 vs SAS"},{pts:12,reb:4,ast:2,pra:18,g:"G6 vs DEN"},{pts:10,reb:3,ast:1,pra:14,g:"G5 vs DEN"},{pts:7,reb:2,ast:2,pra:11,g:"G4 vs DEN"},{pts:11,reb:3,ast:3,pra:17,g:"G3 vs DEN"}], ctx:"Bench scorer; role grows if Edwards limited further" },
  "Shai Gilgeous-Alexander": { team:"OKC", pos:"G", opp:"LAL", game:"okc-lal", injury:null,  lines:{pts:28.5,reb:5.5,ast:6.5,pra:40.5}, stats:[{pts:18,reb:6,ast:7,pra:31,g:"G1 vs LAL (W)"},{pts:38,reb:4,ast:8,pra:50,g:"G4 vs PHX"},{pts:29,reb:3,ast:6,pra:38,g:"G3 vs PHX"},{pts:42,reb:6,ast:5,pra:53,g:"G2 vs PHX"},{pts:31,reb:4,ast:7,pra:42,g:"G1 vs PHX"}], ctx:"Conservative 18 pts in G1 W. OKC 88% win prob G2. Avg 35 PPG vs PHX — expect big game" },
  "Chet Holmgren":           { team:"OKC", pos:"C-F", opp:"LAL", game:"okc-lal", injury:null, lines:{pts:16.5,reb:7.5,ast:3.5,pra:27.5}, stats:[{pts:16,reb:8,ast:3,pra:27,g:"G1 vs LAL"},{pts:22,reb:10,ast:4,pra:36,g:"G4 vs PHX"},{pts:18,reb:9,ast:3,pra:30,g:"G3 vs PHX"},{pts:20,reb:7,ast:4,pra:31,g:"G2 vs PHX"},{pts:14,reb:8,ast:2,pra:24,g:"G1 vs PHX"}], ctx:"Usage way up with Williams OUT. LAL undersized inside" },
  "Jalen Williams":          { team:"OKC", pos:"F", opp:"LAL", game:"okc-lal", injury:"⚠️ OUT — Hamstring", lines:{pts:22.5,reb:5.5,ast:5.5,pra:33.5}, stats:[{pts:0,reb:0,ast:0,pra:0,g:"DNP"},{pts:28,reb:6,ast:5,pra:39,g:"G4 vs PHX"},{pts:24,reb:4,ast:6,pra:34,g:"G3 vs PHX"},{pts:22,reb:5,ast:4,pra:31,g:"G2 vs PHX"},{pts:19,reb:4,ast:5,pra:28,g:"G1 vs PHX"}], ctx:"🚫 OUT — props OFF the board" },
  "Isaiah Hartenstein":      { team:"OKC", pos:"C", opp:"LAL", game:"okc-lal", injury:null,  lines:{pts:9.5,reb:9.5,ast:2.5,pra:21.5}, stats:[{pts:10,reb:10,ast:3,pra:23,g:"G1 vs LAL"},{pts:12,reb:12,ast:2,pra:26,g:"G4 vs PHX"},{pts:9,reb:9,ast:3,pra:21,g:"G3 vs PHX"},{pts:11,reb:11,ast:2,pra:24,g:"G2 vs PHX"},{pts:8,reb:8,ast:2,pra:18,g:"G1 vs PHX"}], ctx:"Double-double in 4 of 5 games. LAL has no interior answer" },
  "Lu Dort":                 { team:"OKC", pos:"G-F", opp:"LAL", game:"okc-lal", injury:null, lines:{pts:11.5,reb:3.5,ast:1.5,pra:16.5}, stats:[{pts:12,reb:4,ast:2,pra:18,g:"G1 vs LAL"},{pts:14,reb:3,ast:2,pra:19,g:"G4 vs PHX"},{pts:10,reb:4,ast:1,pra:15,g:"G3 vs PHX"},{pts:16,reb:5,ast:2,pra:23,g:"G2 vs PHX"},{pts:9,reb:3,ast:2,pra:14,g:"G1 vs PHX"}], ctx:"Elite defender; expanded role with Williams out" },
  "Alex Caruso":             { team:"OKC", pos:"G", opp:"LAL", game:"okc-lal", injury:null,  lines:{pts:9.5,reb:2.5,ast:3.5,pra:15.5}, stats:[{pts:11,reb:3,ast:4,pra:18,g:"G1 vs LAL"},{pts:9,reb:3,ast:3,pra:15,g:"G4 vs PHX"},{pts:12,reb:4,ast:4,pra:20,g:"G3 vs PHX"},{pts:8,reb:2,ast:3,pra:13,g:"G2 vs PHX"},{pts:10,reb:3,ast:4,pra:17,g:"G1 vs PHX"}], ctx:"Motor never stops vs old team" },
  "Aaron Wiggins":           { team:"OKC", pos:"G-F", opp:"LAL", game:"okc-lal", injury:null, lines:{pts:8.5,reb:3.5,ast:1.5,pra:13.5}, stats:[{pts:9,reb:4,ast:1,pra:14,g:"G1 vs LAL"},{pts:11,reb:3,ast:2,pra:16,g:"G4 vs PHX"},{pts:7,reb:3,ast:1,pra:11,g:"G3 vs PHX"},{pts:10,reb:4,ast:1,pra:15,g:"G2 vs PHX"},{pts:8,reb:3,ast:2,pra:13,g:"G1 vs PHX"}], ctx:"Spot starter role with Williams out" },
  "LeBron James":            { team:"LAL", pos:"F", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:22.5,reb:8.5,ast:8.5,pra:39.5}, stats:[{pts:22,reb:9,ast:8,pra:39,g:"G1 vs OKC"},{pts:28,reb:7,ast:10,pra:45,g:"G6 vs HOU"},{pts:31,reb:8,ast:9,pra:48,g:"G5 vs HOU"},{pts:24,reb:10,ast:7,pra:41,g:"G4 vs HOU"},{pts:27,reb:6,ast:11,pra:44,g:"G3 vs HOU"}], ctx:"Biggest underdog (+1200) of career. Must carry without Luka. PRA near avg" },
  "Anthony Davis":           { team:"LAL", pos:"C-F", opp:"OKC", game:"okc-lal", injury:null, lines:{pts:24.5,reb:11.5,ast:3.5,pra:39.5}, stats:[{pts:26,reb:12,ast:3,pra:41,g:"G1 vs OKC"},{pts:24,reb:11,ast:2,pra:37,g:"G6 vs HOU"},{pts:28,reb:13,ast:3,pra:44,g:"G5 vs HOU"},{pts:22,reb:10,ast:2,pra:34,g:"G4 vs HOU"},{pts:30,reb:14,ast:4,pra:48,g:"G3 vs HOU"}], ctx:"Dominant every game. Hit pts OVER in 4 of 5. Must-carry with Luka out" },
  "Austin Reaves":           { team:"LAL", pos:"G", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:17.5,reb:3.5,ast:4.5,pra:25.5}, stats:[{pts:18,reb:4,ast:5,pra:27,g:"G1 vs OKC"},{pts:22,reb:3,ast:6,pra:31,g:"G6 vs HOU"},{pts:16,reb:4,ast:4,pra:24,g:"G5 vs HOU"},{pts:20,reb:3,ast:5,pra:28,g:"G4 vs HOU"},{pts:14,reb:5,ast:4,pra:23,g:"G3 vs HOU"}], ctx:"Healthy Reaves is LAL's #2 scorer without Luka. High floor" },
  "Luka Dončić":             { team:"LAL", pos:"G-F", opp:"OKC", game:"okc-lal", injury:"⚠️ OUT — Achilles (full series)", lines:{pts:30.5,reb:8.5,ast:9.5,pra:48.5}, stats:[{pts:0,reb:0,ast:0,pra:0,g:"DNP entire series"},{pts:36,reb:9,ast:10,pra:55,g:"Regular season"}], ctx:"🚫 OUT full series" },
  "Rui Hachimura":           { team:"LAL", pos:"F", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:13.5,reb:5.5,ast:1.5,pra:20.5}, stats:[{pts:14,reb:5,ast:2,pra:21,g:"G1 vs OKC"},{pts:16,reb:6,ast:1,pra:23,g:"G6 vs HOU"},{pts:12,reb:4,ast:2,pra:18,g:"G5 vs HOU"},{pts:18,reb:7,ast:2,pra:27,g:"G4 vs HOU"},{pts:11,reb:4,ast:1,pra:16,g:"G3 vs HOU"}], ctx:"Consistent starter without Luka" },
  "D'Angelo Russell":        { team:"LAL", pos:"G", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:11.5,reb:2.5,ast:5.5,pra:19.5}, stats:[{pts:12,reb:3,ast:6,pra:21,g:"G1 vs OKC"},{pts:15,reb:4,ast:7,pra:26,g:"G6 vs HOU"},{pts:10,reb:3,ast:5,pra:18,g:"G5 vs HOU"},{pts:13,reb:2,ast:6,pra:21,g:"G4 vs HOU"},{pts:8,reb:3,ast:5,pra:16,g:"G3 vs HOU"}], ctx:"Hit assists OVER in 4 of 5 with Luka out" },
};

const TEAMS = {
  NYK:{name:"New York Knicks",color:"#F58426",bg:"#1a0e00",series:"NYK leads PHI 2-0",matchup:"phi-nyk"},
  PHI:{name:"Philadelphia 76ers",color:"#006BB6",bg:"#00101f",series:"PHI trails NYK 0-2",matchup:"phi-nyk"},
  DET:{name:"Detroit Pistons",color:"#C8102E",bg:"#1f0005",series:"DET leads CLE 1-0",matchup:"det-cle"},
  CLE:{name:"Cleveland Cavaliers",color:"#860038",bg:"#1f0008",series:"CLE trails DET 0-1",matchup:"det-cle"},
  SAS:{name:"San Antonio Spurs",color:"#C4CED4",bg:"#12151a",series:"SAS leads MIN 1-0",matchup:"sas-min"},
  MIN:{name:"Minnesota Timberwolves",color:"#236192",bg:"#00060f",series:"MIN trails SAS 0-1",matchup:"sas-min"},
  OKC:{name:"Oklahoma City Thunder",color:"#EF3B24",bg:"#1f0800",series:"OKC leads LAL 1-0",matchup:"okc-lal"},
  LAL:{name:"Los Angeles Lakers",color:"#FDB927",bg:"#1f1600",series:"LAL trails OKC 0-1",matchup:"okc-lal"},
};

const GAME_LINES = {
  "phi-nyk":{label:"PHI @ NYK — EC Semis G3",spread:"NYK -3.5",total:217.5,ml:{NYK:-170,PHI:+145},wp:{NYK:53.3,PHI:46.7},note:"Embiid RULED OUT. PHI must-win at home."},
  "det-cle":{label:"CLE @ DET — EC Semis G2",spread:"DET -4.5",total:211.5,ml:{DET:-195,CLE:+160},wp:{DET:59.1,CLE:40.9},note:"Physical slugfest. CLE clawed back from -17 in G1."},
  "okc-lal":{label:"LAL @ OKC — WC Semis G2",spread:"OKC -13.5",total:218.5,ml:{OKC:-750,LAL:+530},wp:{OKC:88.1,LAL:11.9},note:"Williams + Doncic both OUT. LeBron biggest underdog of career."},
  "sas-min":{label:"SAS @ MIN — WC Semis G3",spread:"SAS -5.5",total:215.5,ml:{SAS:-220,MIN:+180},wp:{SAS:68,MIN:32},note:"SAS blew out MIN in G2 (+24 at half). G3 in Minneapolis."},
};

// ─── PARLAY INTELLIGENCE ENGINE ───────────────────────────────────────────────
function analyze(player, prop) {
  if (player.injury) return null;
  const line = player.lines[prop]; if (!line) return null;
  const vals = player.stats.map(s => s[prop] || 0);
  const avg = vals.reduce((a,b)=>a+b,0)/vals.length;
  const hitPct = (vals.filter(v=>v>line).length/vals.length)*100;
  const edge = avg - line;
  const conf = Math.min(94, Math.max(28, hitPct + (edge>0?10:-8)));
  const rec = hitPct>=60&&edge>0?"HIGHER": hitPct<=40||edge<-1.5?"LOWER":"LEAN HIGHER";
  const str = conf>=75?"🔥 STRONG": conf>=60?"✅ SOLID":"⚠️ LEAN";
  return {avg:avg.toFixed(1),line,hitPct:hitPct.toFixed(0),conf:conf.toFixed(0),edge:edge.toFixed(1),rec,str};
}

// Correlation bonus: legs from same game that reinforce each other
function correlationBonus(legs) {
  const games = legs.map(l => PLAYERS_DATA[l.name]?.game);
  const sameGame = games.filter((g,i) => games.indexOf(g)!==i).length;
  // Same team stacks (injury-boost correlation)
  const teams = legs.map(l => PLAYERS_DATA[l.name]?.team);
  const sameTeam = teams.filter((t,i) => teams.indexOf(t)!==i).length;
  // Opposing teams in same game = negative correlation (one wins, other suffers)
  const gamePairs = {};
  legs.forEach(l => {
    const g = PLAYERS_DATA[l.name]?.game;
    const t = PLAYERS_DATA[l.name]?.team;
    if (!gamePairs[g]) gamePairs[g] = new Set();
    gamePairs[g].add(t);
  });
  const opposingPairs = Object.values(gamePairs).filter(s => s.size > 1).length;
  return (sameTeam * 3) - (opposingPairs * 4) + (sameGame > 0 ? 2 : 0);
}

// Build all candidate legs and score them
function buildTopParlays() {
  const propKeys = ["pts","reb","ast","pra"];
  const candidates = [];

  Object.entries(PLAYERS_DATA).forEach(([name, player]) => {
    if (player.injury) return;
    propKeys.forEach(prop => {
      const a = analyze(player, prop);
      if (!a) return;
      const conf = parseFloat(a.conf);
      const edge = parseFloat(a.edge);
      const hitPct = parseFloat(a.hitPct);
      // Only include bets with clear directional signal (not lean)
      if (a.rec === "LEAN HIGHER") return;
      // Score = weighted composite
      const score = (conf * 0.5) + (hitPct * 0.3) + (Math.abs(edge) * 2);
      candidates.push({ name, prop, a, player, score, conf, edge, hitPct });
    });
  });

  // Sort all candidates by score descending
  candidates.sort((a,b) => b.score - a.score);

  // Build 5 distinct 3-leg parlays using greedy selection with diversity rules
  const parlays = [];
  const usedCombos = new Set();

  // Strategy types for variety
  const strategies = [
    { label:"💎 Best Value", desc:"Highest-confidence legs across slate", filter: c => c.conf >= 75 },
    { label:"🔥 Injury Stack", desc:"Leveraging Embiid OUT + Williams OUT usage shifts", filter: c => ["PHI","OKC","CLE"].includes(c.player.team) || c.name==="Tyrese Maxey"||c.name==="Chet Holmgren"||c.name==="James Harden"||c.name==="LeBron James"||c.name==="Anthony Davis" },
    { label:"🎯 Same-Game Correlated", desc:"PHI @ NYK props that move together", filter: c => c.player.game === "phi-nyk" },
    { label:"⚡ High-Edge Undervalued", desc:"Biggest statistical edge vs Underdog lines", filter: c => parseFloat(c.edge) >= 2.5 },
    { label:"🏆 Multi-Game Diversified", desc:"One strong leg from each game", filter: () => true },
  ];

  strategies.forEach((strat, si) => {
    const pool = candidates.filter(strat.filter);
    if (pool.length < 3) return;

    const legs = [];
    const usedPlayers = new Set();
    const usedGames = si === 4 ? new Set() : null; // only enforce game diversity for last strategy

    for (const c of pool) {
      if (legs.length >= 3) break;
      if (usedPlayers.has(c.name)) continue;
      if (usedGames && usedGames.has(c.player.game)) continue;
      legs.push(c);
      usedPlayers.add(c.name);
      if (usedGames) usedGames.add(c.player.game);
    }

    if (legs.length < 2) return;

    const avgConf = legs.reduce((s,l)=>s+l.conf,0)/legs.length;
    const corr = correlationBonus(legs);
    const totalScore = avgConf + corr + legs.reduce((s,l)=>s+parseFloat(l.edge),0);
    const estOdds = Math.round((Math.pow(1.92, legs.length)-1)*100);

    const comboKey = legs.map(l=>`${l.name}${l.prop}`).sort().join('|');
    if (usedCombos.has(comboKey)) return;
    usedCombos.add(comboKey);

    parlays.push({ ...strat, legs, avgConf: avgConf.toFixed(0), totalScore: totalScore.toFixed(0), estOdds, corr });
  });

  return parlays.slice(0, 5);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("top5");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [prop, setProp] = useState("pts");
  const [sort, setSort] = useState("conf");
  const [expanded, setExpanded] = useState(null);
  const [parlay, setParlay] = useState([]);
  const [ai, setAi] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [top5Parlays] = useState(() => buildTopParlays());
  const [top5AI, setTop5AI] = useState({});
  const [top5Loading, setTop5Loading] = useState({});
  const [top5Expanded, setTop5Expanded] = useState(0);

  const addParlay = (name, leg, rec) => { const k=`${name}-${leg}`; if(!parlay.find(p=>p.k===k)) setParlay(v=>[...v,{k,name,leg,rec}]); };
  const rmParlay = k => setParlay(v=>v.filter(p=>p.k!==k));

  const rows = Object.entries(PLAYERS_DATA)
    .filter(([,p]) => teamFilter==="ALL" || p.team===teamFilter)
    .map(([name,player]) => ({name, player, a: analyze(player, prop)}))
    .sort((x,y) => {
      if(sort==="conf") return parseFloat(y.a?.conf||0)-parseFloat(x.a?.conf||0);
      if(sort==="edge") return parseFloat(y.a?.edge||-99)-parseFloat(x.a?.edge||-99);
      return x.name.localeCompare(y.name);
    });

  const fetchAI = useCallback(async () => {
    setAiLoading(true); setAi("");
    const topRows = rows.filter(r=>r.a&&!r.player.injury).slice(0,7);
    const prompt = `Expert NBA playoff Underdog Fantasy analyst. May 6-7 2026.
INJURIES: Joel Embiid OUT (PHI G3), Jalen Williams OUT (OKC G2+), Luka Doncic OUT (full OKC series), Anthony Edwards ankle limited.
SERIES: NYK leads PHI 2-0, OKC leads LAL 1-0 (88% win prob), SAS leads MIN 1-0 (G2 blowout), DET leads CLE 1-0.

TOP ${prop.toUpperCase()} PROPS (Underdog Fantasy lines):
${topRows.map(r=>`${r.name} (${r.player.team}): line ${r.a.line}, avg ${r.a.avg}, hit ${r.a.hitPct}%, edge ${r.a.edge>0?'+':''}${r.a.edge} → ${r.a.rec}. ${r.player.ctx}`).join('\n')}

Give 3-4 sharp sentences. Pick #1 clearest Underdog value, mention injury impact, suggest a 2-3 leg entry. Direct betting language, use emojis.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const d = await r.json();
      setAi(d.content?.map(c=>c.text||"").join("")||"Unable to generate.");
    } catch { setAi("⚠️ Could not connect. Please try again."); }
    setAiLoading(false);
  }, [rows, prop]);

  const fetchTop5AI = useCallback(async (idx, parlay) => {
    setTop5Loading(v=>({...v,[idx]:true}));
    const legSummary = parlay.legs.map(l =>
      `${l.name} (${l.player.team}) ${l.prop.toUpperCase()} ${l.a.rec} ${l.a.line} | avg ${l.a.avg} | hit ${l.a.hitPct}% | edge ${l.a.edge>0?'+':''}${l.a.edge} | ${l.player.ctx}`
    ).join('\n');
    const prompt = `NBA playoff Underdog Fantasy expert. May 6-7 2026.
INJURIES: Embiid OUT (PHI), Williams OUT (OKC), Doncic OUT (LAL full series), Edwards ankle limited.
SERIES: NYK leads PHI 2-0, OKC leads LAL 1-0 (88% win prob G2), SAS leads MIN 1-0, DET leads CLE 1-0.

Parlay Strategy: "${parlay.label}" — ${parlay.desc}
Est. Odds: +${parlay.estOdds} | Avg Confidence: ${parlay.avgConf}%

LEGS:
${legSummary}

In 3-4 punchy sentences, explain WHY this specific parlay makes sense as a unit:
1. What narrative/theme connects these legs
2. The strongest individual leg and why
3. Any correlation or risk to know about
4. Final verdict: fire or fade?
Use emojis, sharp betting language, be direct.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:prompt}]})});
      const d = await r.json();
      const txt = d.content?.map(c=>c.text||"").join("")||"Unable to generate.";
      setTop5AI(v=>({...v,[idx]:txt}));
    } catch { setTop5AI(v=>({...v,[idx]:"⚠️ Could not connect."})); }
    setTop5Loading(v=>({...v,[idx]:false}));
  }, []);

  const propBtns = [{k:"pts",l:"Points"},{k:"reb",l:"Rebounds"},{k:"ast",l:"Assists"},{k:"pra",l:"PRA"},{k:"blk",l:"Blocks"}];
  const RANK_COLORS = ["#f5a623","#c0c0c0","#cd7f32","#6eb5ff","#a8ff78"];
  const RANK_LABELS = ["#1 BEST BET","#2 SILVER","#3 BRONZE","#4 VALUE","#5 SLEEPER"];

  return (
    <div style={{background:"#07070f",minHeight:"100vh",fontFamily:"'Barlow Condensed',Impact,sans-serif",color:"#e0ddd6"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#f5a623;border-radius:2px}
        .T{background:none;border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;padding:9px 14px;color:#555;text-transform:uppercase;transition:all .2s;border-bottom:3px solid transparent;white-space:nowrap}
        .T.on{color:#f5a623;border-bottom-color:#f5a623}.T:hover{color:#f5a623}
        .B{background:#0f1525;border:1.5px solid #1c2540;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;padding:4px 11px;color:#777;border-radius:4px;text-transform:uppercase;letter-spacing:1px;transition:all .2s}
        .B.on{background:#f5a623;border-color:#f5a623;color:#07070f}.B:hover:not(.on){border-color:#f5a623;color:#f5a623}
        .TB{cursor:pointer;padding:6px 12px;border-radius:5px;border:1.5px solid #1c2540;background:#0c0c1e;transition:all .2s;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;letter-spacing:1px;color:#555}
        .TB.on{border-color:var(--c);color:var(--c);background:var(--b)}.TB:hover:not(.on){border-color:#2a2a3a;color:#999}
        .card{background:#0e1422;border:1px solid #18213a;border-radius:9px;padding:14px;cursor:pointer;transition:transform .12s,box-shadow .12s}
        .card:hover{transform:translateY(-1px);box-shadow:0 5px 20px rgba(245,166,35,.06)}
        .card.open{border-color:#2a3560}
        .HI{background:#0a2a0a;color:#4caf50;border:1px solid #4caf50;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:1px}
        .LO{background:#2a0a0a;color:#f44336;border:1px solid #f44336;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:1px}
        .LN{background:#2a2200;color:#ffc107;border:1px solid #ffc107;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:1px}
        .OT{background:#2a0505;color:#ff5555;border:1px solid #aa2222;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:2px}
        .add{background:none;border:1px dashed #2a3040;color:#444;cursor:pointer;padding:4px 10px;border-radius:4px;font-size:11px;font-family:'Barlow',sans-serif;transition:all .2s}
        .add:hover{border-color:#f5a623;color:#f5a623}
        .AI{background:linear-gradient(135deg,#f5a623,#d97e10);border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;padding:9px 22px;color:#07070f;border-radius:7px;letter-spacing:1px;text-transform:uppercase;transition:all .2s}
        .AI:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(245,166,35,.4)}.AI:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .AI-sm{background:linear-gradient(135deg,#f5a623,#d97e10);border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;padding:6px 14px;color:#07070f;border-radius:5px;letter-spacing:1px;text-transform:uppercase;transition:all .2s}
        .AI-sm:hover{box-shadow:0 2px 10px rgba(245,166,35,.4)}.AI-sm:disabled{opacity:.6;cursor:not-allowed}
        .pulse{animation:pulse 1.8s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .cb{height:5px;background:#141e30;border-radius:3px;overflow:hidden;margin-top:3px}
        .cf{height:100%;border-radius:3px;transition:width .7s ease}
        .lbl{font-size:9px;letter-spacing:2px;color:#333;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:4px}
        .pi{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #141e30}
        .rx{background:none;border:none;color:#f44336;cursor:pointer;font-size:16px}
        .g2{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:11px}
        .inj{background:#180808;border:1px solid #3a1212;border-radius:7px;padding:10px;display:flex;align-items:flex-start;gap:9px;flex:1;min-width:180px}
        .pc{cursor:pointer;border-radius:10px;padding:16px;transition:all .2s;border:2px solid transparent}
        .pc:hover{transform:translateY(-1px)}
        .pc.sel{border-color:var(--rc) !important}
        .leg-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #141e30}
        .leg-row:last-child{border-bottom:none}
        .rank-badge{font-size:9px;font-weight:900;letter-spacing:2px;padding:3px 8px;border-radius:3px;border:1px solid currentColor}
      `}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(180deg,#0b0b1e,#07070f)",borderBottom:"1px solid #141e30",padding:"0 14px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,paddingBottom:6,flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,color:"#f5a623",lineHeight:1}}>🏀 PLAYOFF EDGE</div>
              <div style={{fontSize:9,color:"#333",letterSpacing:3,fontFamily:"'Barlow',sans-serif",marginTop:1}}>NBA 2026 · UNDERDOG FANTASY LINES · FULL ROSTERS · AI PARLAY INTELLIGENCE</div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["Underdog","DraftKings","FanDuel","BetMGM","SportsLine"].map(b=>(
                <span key={b} style={{background:"#0f1525",border:"1px solid #1c2540",padding:"2px 7px",borderRadius:3,fontSize:9,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:1,flexWrap:"wrap"}}>
            {[["top5","🏆 Top 5 Parlays"],["props","📊 Player Props"],["games","🏟️ Games"],["parlay",`🎲 My Slip${parlay.length?` (${parlay.length})`:""}`]].map(([t,l])=>(
              <button key={t} className={`T ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"14px"}}>

        {/* INJURY BANNER */}
        <div style={{marginBottom:14}}>
          <div className="lbl">🚨 Injury Report</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {[{n:"Joel Embiid",s:"OUT — Hip/Ankle · PHI G3+",c:"#f44336"},{n:"Jalen Williams",s:"OUT — Hamstring · OKC G2+",c:"#f44336"},{n:"Luka Dončić",s:"OUT — Achilles · Full Series",c:"#f44336"},{n:"Anthony Edwards",s:"Ankle — Limited",c:"#ffc107"}].map(i=>(
              <div key={i.n} className="inj">
                <div style={{fontSize:14}}>⚠️</div>
                <div><div style={{fontSize:12,fontWeight:800,color:i.c,lineHeight:1.2}}>{i.n}</div><div style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif",marginTop:1}}>{i.s}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ TOP 5 PARLAYS TAB ══════════════════════════════════════════════════ */}
        {tab==="top5" && (
          <div>
            <div style={{marginBottom:16,padding:"14px 16px",background:"linear-gradient(135deg,#0f1020,#141830)",border:"1px solid #1c2540",borderRadius:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{fontSize:22,fontWeight:900,color:"#f5a623",letterSpacing:1}}>🤖 AI PARLAY INTELLIGENCE</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:"#888",fontFamily:"'Barlow',sans-serif",lineHeight:1.6}}>
                    Our engine scored <strong style={{color:"#e0ddd6"}}>every prop combination</strong> across all {Object.keys(PLAYERS_DATA).filter(n=>!PLAYERS_DATA[n].injury).length} active players using hit rate, edge, correlation bonuses, and injury-adjusted usage. These are the 5 highest-value parlays on today's slate.
                  </div>
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
              {top5Parlays.map((p, i) => (
                <button key={i} className="pc" style={{"--rc":RANK_COLORS[i], background: top5Expanded===i?"#0e1a2e":"#0a0f1c", border:`2px solid ${top5Expanded===i?RANK_COLORS[i]:"#1c2540"}`, flex:"1 1 140px", minWidth:130, textAlign:"left"}} onClick={()=>setTop5Expanded(i)}>
                  <div style={{fontSize:9,fontWeight:900,color:RANK_COLORS[i],letterSpacing:2,marginBottom:4}}>{RANK_LABELS[i]}</div>
                  <div style={{fontSize:13,fontWeight:800,lineHeight:1.3,color:"#e0ddd6"}}>{p.label}</div>
                  <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                    <div style={{fontSize:11,color:RANK_COLORS[i],fontWeight:700}}>+{p.estOdds}</div>
                    <div style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{p.avgConf}% avg conf</div>
                  </div>
                </button>
              ))}
            </div>

            {top5Parlays[top5Expanded] && (() => {
              const p = top5Parlays[top5Expanded];
              const rc = RANK_COLORS[top5Expanded];
              return (
                <div style={{background:"#0a0f1c",border:`1px solid ${rc}44`,borderRadius:12,padding:18,marginBottom:14}}>
                  {/* Parlay header */}
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:14}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,fontWeight:900,color:rc,letterSpacing:2,border:`1px solid ${rc}`,padding:"2px 8px",borderRadius:3}}>{RANK_LABELS[top5Expanded]}</span>
                        <div style={{fontSize:22,fontWeight:900,color:rc}}>{p.label}</div>
                      </div>
                      <div style={{fontSize:12,color:"#777",fontFamily:"'Barlow',sans-serif",marginTop:3}}>{p.desc}</div>
                    </div>
                    <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                      <div style={{textAlign:"center"}}><div className="lbl">Est. Odds</div><div style={{fontSize:26,fontWeight:900,color:rc}}>+{p.estOdds}</div></div>
                      <div style={{textAlign:"center"}}><div className="lbl">Avg Conf</div><div style={{fontSize:26,fontWeight:900,color:parseFloat(p.avgConf)>=75?"#4caf50":"#f5a623"}}>{p.avgConf}%</div></div>
                      <div style={{textAlign:"center"}}><div className="lbl">Legs</div><div style={{fontSize:26,fontWeight:900,color:"#e0ddd6"}}>{p.legs.length}</div></div>
                    </div>
                  </div>

                  {/* Legs */}
                  <div style={{background:"#0d1220",borderRadius:8,padding:"4px 12px",marginBottom:14}}>
                    {p.legs.map((leg, li) => {
                      const teamColor = TEAMS[leg.player.team]?.color || "#f5a623";
                      const cc = leg.conf>=75?"#4caf50":leg.conf>=60?"#f5a623":"#f44336";
                      return (
                        <div key={li} className="leg-row">
                          <div style={{fontSize:18,fontWeight:900,color:rc,minWidth:20,textAlign:"center"}}>{li+1}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              <span style={{fontSize:15,fontWeight:800}}>{leg.name}</span>
                              <span style={{fontSize:10,color:teamColor,fontWeight:700,fontFamily:"'Barlow',sans-serif"}}>{leg.player.team}</span>
                              <span style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{leg.prop.toUpperCase()} {leg.a.rec} {leg.a.line}</span>
                            </div>
                            <div style={{fontSize:11,color:"#557",fontFamily:"'Barlow',sans-serif",marginTop:2}}>{leg.player.ctx}</div>
                          </div>
                          <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
                            <div style={{textAlign:"center"}}><div className="lbl">Avg</div><div style={{fontSize:14,fontWeight:800,color:parseFloat(leg.a.avg)>leg.a.line?"#4caf50":"#f44336"}}>{leg.a.avg}</div></div>
                            <div style={{textAlign:"center"}}><div className="lbl">Hit%</div><div style={{fontSize:14,fontWeight:800,color:cc}}>{leg.a.hitPct}%</div></div>
                            <div style={{textAlign:"center"}}><div className="lbl">Edge</div><div style={{fontSize:14,fontWeight:800,color:parseFloat(leg.a.edge)>0?"#4caf50":"#f44336"}}>{parseFloat(leg.a.edge)>0?"+":""}{leg.a.edge}</div></div>
                            <span className={leg.a.rec==="HIGHER"?"HI":"LO"}>{leg.a.rec}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action buttons */}
                  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
                    <button className="AI-sm" onClick={()=>fetchTop5AI(top5Expanded, p)} disabled={top5Loading[top5Expanded]}>
                      {top5Loading[top5Expanded]?<span className="pulse">ANALYZING...</span>:"🤖 GET AI BREAKDOWN"}
                    </button>
                    <button className="add" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{
                      p.legs.forEach(l=>addParlay(l.name,`${l.prop.toUpperCase()} ${l.a.rec} ${l.a.line}`,l.a.rec));
                      setTab("parlay");
                    }}>
                      + Add All Legs to My Slip →
                    </button>
                  </div>

                  {/* AI breakdown */}
                  {top5Loading[top5Expanded] && (
                    <div style={{color:"#f5a623",fontFamily:"'Barlow',sans-serif",fontSize:12,padding:"10px 0"}} className="pulse">
                      Analyzing parlay narrative, correlation, and risk factors...
                    </div>
                  )}
                  {top5AI[top5Expanded] && !top5Loading[top5Expanded] && (
                    <div style={{background:"#0c1118",borderRadius:8,padding:"12px 14px",border:`1px solid ${rc}22`}}>
                      <div style={{fontSize:10,color:rc,letterSpacing:2,fontWeight:800,marginBottom:8}}>🤖 AI ANALYSIS</div>
                      <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,lineHeight:1.8,color:"#bbb",whiteSpace:"pre-wrap"}}>{top5AI[top5Expanded]}</div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Parlay comparison table */}
            <div style={{background:"#0a0f1c",border:"1px solid #1c2540",borderRadius:10,padding:16}}>
              <div style={{fontSize:16,fontWeight:800,marginBottom:12,letterSpacing:1}}>📊 PARLAY COMPARISON</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Barlow',sans-serif",fontSize:12}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #1c2540"}}>
                      {["Rank","Strategy","Legs","Avg Conf","Est. Odds","Best Leg"].map(h=>(
                        <th key={h} style={{padding:"6px 10px",color:"#444",fontSize:9,letterSpacing:2,textAlign:"left",textTransform:"uppercase"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {top5Parlays.map((p, i) => {
                      const bestLeg = p.legs.reduce((a,b)=>parseFloat(a.conf)>parseFloat(b.conf)?a:b);
                      return (
                        <tr key={i} style={{borderBottom:"1px solid #0f1525",cursor:"pointer",background:top5Expanded===i?"#0e1a2e":"transparent"}} onClick={()=>setTop5Expanded(i)}>
                          <td style={{padding:"8px 10px"}}><span style={{fontSize:11,fontWeight:900,color:RANK_COLORS[i]}}>{RANK_LABELS[i]}</span></td>
                          <td style={{padding:"8px 10px",color:"#ccc",fontWeight:600}}>{p.label}</td>
                          <td style={{padding:"8px 10px",color:"#888"}}>{p.legs.length}</td>
                          <td style={{padding:"8px 10px",color:parseFloat(p.avgConf)>=75?"#4caf50":"#f5a623",fontWeight:700}}>{p.avgConf}%</td>
                          <td style={{padding:"8px 10px",color:RANK_COLORS[i],fontWeight:800}}>+{p.estOdds}</td>
                          <td style={{padding:"8px 10px",color:"#aaa"}}>{bestLeg.name} {bestLeg.prop.toUpperCase()} {bestLeg.a.rec}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ PROPS TAB ══════════════════════════════════════════════════════════ */}
        {tab==="props" && (
          <>
            <div style={{display:"flex",gap:14,marginBottom:12,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div><div className="lbl">Prop Type</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{propBtns.map(p=><button key={p.k} className={`B ${prop===p.k?"on":""}`} onClick={()=>setProp(p.k)}>{p.l}</button>)}</div></div>
              <div><div className="lbl">Sort</div><div style={{display:"flex",gap:5}}>{[["conf","Confidence"],["edge","Edge"],["name","A-Z"]].map(([k,l])=><button key={k} className={`B ${sort===k?"on":""}`} onClick={()=>setSort(k)}>{l}</button>)}</div></div>
            </div>
            <div style={{marginBottom:14}}>
              <div className="lbl">Team Filter ({rows.filter(r=>!r.player.injury&&r.a).length} props)</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <button className={`TB ${teamFilter==="ALL"?"on":""}`} style={{"--c":"#f5a623","--b":"#1a1200"}} onClick={()=>setTeamFilter("ALL")}>ALL</button>
                {Object.entries(TEAMS).map(([ab,t])=>(
                  <button key={ab} className={`TB ${teamFilter===ab?"on":""}`} style={{"--c":t.color,"--b":t.bg}} onClick={()=>setTeamFilter(ab)}>{ab}</button>
                ))}
              </div>
            </div>
            {teamFilter!=="ALL" && (
              <div style={{background:TEAMS[teamFilter]?.bg,border:`1px solid ${TEAMS[teamFilter]?.color}30`,borderRadius:8,padding:"9px 13px",marginBottom:12,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{fontSize:16,fontWeight:800,color:TEAMS[teamFilter]?.color}}>{TEAMS[teamFilter]?.name}</div>
                <div style={{fontSize:12,color:"#666",fontFamily:"'Barlow',sans-serif"}}>{TEAMS[teamFilter]?.series}</div>
                <div style={{fontSize:11,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{GAME_LINES[TEAMS[teamFilter]?.matchup]?.note}</div>
              </div>
            )}
            <div className="g2">
              {rows.map(({name,player,a})=>{
                const teamC = TEAMS[player.team]?.color||"#f5a623";
                const isOpen = expanded===name;
                if(player.injury) return (
                  <div key={name} style={{background:"#100808",border:"1px solid #2a1212",borderRadius:9,padding:14,opacity:.75}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontSize:15,fontWeight:800}}>{name}</div><div style={{fontSize:10,color:"#666",fontFamily:"'Barlow',sans-serif"}}><span style={{color:teamC}}>{player.team}</span> · {player.pos}</div></div>
                      <span className="OT">OUT</span>
                    </div>
                    <div style={{fontSize:11,color:"#f44",fontFamily:"'Barlow',sans-serif",marginTop:6}}>{player.injury}</div>
                  </div>
                );
                if(!a) return null;
                const cc = a.conf>=75?"#4caf50":a.conf>=60?"#f5a623":"#f44336";
                const vals = player.stats.map(s=>s[prop]||0);
                const mx = Math.max(...vals,a.line,1);
                return (
                  <div key={name} className={`card ${isOpen?"open":""}`} style={{borderLeft:`3px solid ${teamC}44`}} onClick={()=>setExpanded(isOpen?null:name)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:800,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div><div style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif",marginTop:1}}><span style={{color:teamC,fontWeight:700}}>{player.team}</span> · {player.pos} · vs {player.opp}</div></div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                        <div style={{display:"flex",gap:5,alignItems:"center"}}><span style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{a.line}</span><span className={a.rec==="HIGHER"?"HI":a.rec==="LOWER"?"LO":"LN"}>{a.rec}</span></div>
                        <div style={{fontSize:10,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{a.str}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:10}}>
                      {[["Avg",a.avg,parseFloat(a.avg)>a.line?"#4caf50":"#f44336"],["Hit%",`${a.hitPct}%`,cc],["Edge",`${parseFloat(a.edge)>0?"+":""}${a.edge}`,parseFloat(a.edge)>0?"#4caf50":"#f44336"]].map(([l,v,c])=>(
                        <div key={l}><div className="lbl">{l}</div><div style={{fontSize:19,fontWeight:800,color:c,lineHeight:1}}>{v}</div></div>
                      ))}
                      <div style={{flex:1,minWidth:50}}><div className="lbl">Conf {a.conf}%</div><div className="cb" style={{marginTop:6}}><div className="cf" style={{width:`${a.conf}%`,background:cc}}/></div><div style={{fontSize:8,color:"#1c2540",fontFamily:"'Barlow',sans-serif",marginTop:2}}>tap ▼</div></div>
                    </div>
                    {isOpen && (
                      <div style={{marginTop:11,paddingTop:11,borderTop:"1px solid #141e30"}}>
                        <div className="lbl">Last 5 Games</div>
                        <div style={{display:"flex",alignItems:"flex-end",gap:3,height:44,marginBottom:4}}>
                          {vals.map((v,i)=>{const h=Math.max(4,(v/mx)*38);return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{width:"100%",maxWidth:36,height:h,background:v>a.line?"#4caf50":"#f44336",borderRadius:"2px 2px 0 0",opacity:.85}}/><div style={{fontSize:9,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{v}</div></div>);})}
                          <div style={{width:1,background:"#f5a62377",height:Math.max(4,(a.line/mx)*38)+13,marginLeft:2}}/>
                          <div style={{fontSize:9,color:"#f5a623",fontFamily:"'Barlow',sans-serif",alignSelf:"flex-end",marginBottom:13,marginLeft:1}}>←{a.line}</div>
                        </div>
                        <div style={{fontSize:11,color:"#667",fontFamily:"'Barlow',sans-serif",lineHeight:1.6,margin:"6px 0 10px"}}>💡 {player.ctx}</div>
                        <button className="add" onClick={e=>{e.stopPropagation();addParlay(name,`${prop.toUpperCase()} ${a.rec} ${a.line}`,a.rec);}}>+ Add to My Slip</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:16,padding:14,background:"#0b0e1a",border:"1px solid #141e30",borderRadius:9}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:10}}>
                <div><div style={{fontSize:17,fontWeight:800}}>🤖 AI SHARP ANALYSIS</div><div style={{fontSize:10,color:"#333",fontFamily:"'Barlow',sans-serif"}}>Injury-adjusted · All 8 teams · Underdog lines</div></div>
                <button className="AI" onClick={fetchAI} disabled={aiLoading}>{aiLoading?<span className="pulse">ANALYZING...</span>:"GET AI EDGE"}</button>
              </div>
              {aiLoading&&<div style={{color:"#f5a623",fontFamily:"'Barlow',sans-serif",fontSize:11}} className="pulse">Cross-referencing lines, injuries, trends...</div>}
              {ai&&!aiLoading&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,lineHeight:1.8,color:"#bbb",whiteSpace:"pre-wrap"}}>{ai}</div>}
              {!ai&&!aiLoading&&<div style={{color:"#222",fontFamily:"'Barlow',sans-serif",fontSize:12}}>Filter by team & prop, then click GET AI EDGE.</div>}
            </div>
          </>
        )}

        {/* ══ GAMES TAB ══════════════════════════════════════════════════════════ */}
        {tab==="games" && (
          <div style={{display:"grid",gap:12}}>
            {Object.entries(GAME_LINES).map(([id,g])=>(
              <div key={id} style={{background:"#0e1422",border:"1px solid #18213a",borderRadius:9,padding:16}}>
                <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{g.label}</div>
                <div style={{fontSize:11,color:"#f5a623",fontFamily:"'Barlow',sans-serif",marginBottom:12}}>📌 {g.note}</div>
                <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12}}>
                  {[["Spread",g.spread],["Total",`O/U ${g.total}`]].map(([l,v])=>(<div key={l}><div className="lbl">{l}</div><div style={{fontSize:19,fontWeight:800}}>{v}</div></div>))}
                  {Object.entries(g.ml).map(([t,ml])=>(<div key={t}><div className="lbl">{t} ML</div><div style={{fontSize:19,fontWeight:800,color:ml>0?"#4caf50":"#f44336"}}>{ml>0?"+":""}{ml}</div></div>))}
                  {Object.entries(g.wp).map(([t,wp])=>(<div key={t}><div className="lbl">{t} Win%</div><div style={{fontSize:19,fontWeight:800,color:wp>55?"#4caf50":wp>45?"#f5a623":"#f44336"}}>{wp}%</div></div>))}
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.entries(g.ml).map(([t,ml])=>(<button key={t} className="add" onClick={()=>addParlay(t,`ML ${ml>0?"+":""}${ml}`,ml<0?"FAVORITE":"UNDERDOG")}>+ {t} ML to Slip</button>))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PARLAY SLIP TAB ════════════════════════════════════════════════════ */}
        {tab==="parlay" && (
          <div>
            <div style={{padding:16,background:"#0b0e1a",border:"1px solid #141e30",borderRadius:9,marginBottom:12}}>
              <div style={{fontSize:20,fontWeight:800,marginBottom:14}}>🎲 MY PARLAY SLIP</div>
              {parlay.length===0?(
                <div style={{color:"#222",fontFamily:"'Barlow',sans-serif",textAlign:"center",padding:"30px 0"}}>
                  No legs yet.<br/><span style={{color:"#444"}}>Go to 🏆 Top 5 Parlays and click "Add All Legs", or expand any player card in 📊 Props.</span>
                </div>
              ):(
                <>
                  {parlay.map(p=>(
                    <div key={p.k} className="pi">
                      <div><div style={{fontSize:14,fontWeight:700}}>{p.name}</div><div style={{fontSize:11,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{p.leg}</div></div>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <span className={p.rec==="HIGHER"||p.rec==="FAVORITE"?"HI":p.rec==="LEAN HIGHER"?"LN":"LO"}>{p.rec}</span>
                        <button className="rx" onClick={()=>rmParlay(p.k)}>×</button>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:14,background:"#0f1525",borderRadius:7,padding:13}}>
                    <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:12}}>
                      <div><div className="lbl">Legs</div><div style={{fontSize:24,fontWeight:800,color:"#f5a623"}}>{parlay.length}</div></div>
                      <div><div className="lbl">Est. Payout (~1.9x/leg)</div><div style={{fontSize:24,fontWeight:800}}>+{Math.round((Math.pow(1.9,parlay.length)-1)*100)}</div></div>
                    </div>
                    <button className="AI" style={{width:"100%"}} onClick={fetchAI} disabled={aiLoading}>{aiLoading?<span className="pulse">VALIDATING...</span>:"🤖 VALIDATE WITH AI"}</button>
                  </div>
                  {ai&&!aiLoading&&<div style={{marginTop:12,fontFamily:"'Barlow',sans-serif",fontSize:13,lineHeight:1.8,color:"#bbb",whiteSpace:"pre-wrap"}}>{ai}</div>}
                </>
              )}
            </div>
            <div style={{padding:16,background:"#0b0e1a",border:"1px solid #141e30",borderRadius:9}}>
              <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>💡 UNDERDOG SHARP TIPS</div>
              {["Flex Entry (3+ picks): partial payout if 1 leg misses — great for PRA stacks","Embiid OUT → Stack Maxey + Harden PRA HIGHER (usage floods both)","Williams OUT → SGA was conservative G1 (18 pts). HIGHER pts G2 is a strong angle","Edwards ankle: LOWER rebounds (3.5) is the highest-edge play on the slate","Wembanyama: model projects UNDER 4.5 blocks G2 — G1 was a historic outlier","Duren + Gobert both hit reb OVER in 4 of last 5 — double-double stack is high floor"].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:7,fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666",lineHeight:1.5}}>
                  <span style={{color:"#f5a623",fontWeight:700,minWidth:14}}>{i+1}.</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{marginTop:20,textAlign:"center",fontSize:9,color:"#14141e",fontFamily:"'Barlow',sans-serif",lineHeight:2}}>
          ⚠️ FOR ENTERTAINMENT PURPOSES ONLY · NOT FINANCIAL ADVICE · GAMBLE RESPONSIBLY<br/>
          Lines: Underdog Fantasy · DraftKings · FanDuel · BetMGM · Stats: SportRadar · Analysis: SI.com, CBS SportsLine, BettingPros
        </div>
      </div>
    </div>
  );
}
