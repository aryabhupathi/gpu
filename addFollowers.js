const fs = require('fs');

let content = fs.readFileSync('src/app/profile/ProfileClient.tsx', 'utf8');

// 1. Add tabs to the Tabs component
const tabsToFind = `<Tab
            label={\`Liked Posts (\${likedForums.length})\`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
        </Tabs>`;
const tabsToReplace = `<Tab
            label={\`Liked Posts (\${likedForums.length})\`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
          <Tab
            label={\`Followers (\${user.followers?.length || 0})\`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
          <Tab
            label={\`Following (\${user.following?.length || 0})\`}
            sx={{ fontWeight: 600, textTransform: "none" }}
          />
        </Tabs>`;
content = content.replace(tabsToFind, tabsToReplace);

// 2. Add Tab panels for 3 and 4
const panelsToFind = `      )}
    </Container>`;
const panelsToReplace = `      )}
      {tab === 3 && (
        <Box>
          {user.followers && user.followers.length > 0 ? (
            <Grid container spacing={2}>
              {user.followers.map((f) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.follower.id}>
                  <Link href={\`/u/\${f.follower.id}\`} style={{ textDecoration: 'none' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 3,
                        border: '1px solid #E5E7EB',
                        '&:hover': {
                          borderColor: '#7C3AED',
                          bgcolor: 'rgba(124, 58, 237, 0.02)',
                        }
                      }}
                    >
                      <Avatar src={f.follower.image || ""} sx={{ width: 48, height: 48 }}>
                        {f.follower.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {f.follower.name || "Unknown"}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
              <Typography variant="body1" color="text.secondary">
                You don't have any followers yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      {tab === 4 && (
        <Box>
          {user.following && user.following.length > 0 ? (
            <Grid container spacing={2}>
              {user.following.map((f) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.following.id}>
                  <Link href={\`/u/\${f.following.id}\`} style={{ textDecoration: 'none' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 3,
                        border: '1px solid #E5E7EB',
                        '&:hover': {
                          borderColor: '#7C3AED',
                          bgcolor: 'rgba(124, 58, 237, 0.02)',
                        }
                      }}
                    >
                      <Avatar src={f.following.image || ""} sx={{ width: 48, height: 48 }}>
                        {f.following.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {f.following.name || "Unknown"}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
              <Typography variant="body1" color="text.secondary">
                You aren't following anyone yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Container>`;
content = content.replace(panelsToFind, panelsToReplace);

fs.writeFileSync('src/app/profile/ProfileClient.tsx', content, 'utf8');
console.log('Modified ProfileClient.tsx');
