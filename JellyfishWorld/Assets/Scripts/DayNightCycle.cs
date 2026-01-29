using UnityEngine;
using System.Collections.Generic;

public class DayNightCycle : MonoBehaviour
{
    public Light directionalLight;
    public bool autoFindDirectionalLight = true;
    public bool enableAutoTime = true;
    public float cycleDuration = 120f; // Duration of one day-night cycle in seconds

    [Range(0, 1)]
    public float timeOfDay = 0.5f; // 0 = midnight, 0.5 = noon, 1 = midnight

    private float timeElapsed = 0f;
    private List<JellyfishMaterial> jellyfishMaterials;

    private void Start()
    {
        // Find directional light if not assigned
        if (autoFindDirectionalLight && directionalLight == null)
        {
            Light[] lights = FindObjectsOfType<Light>();
            foreach (Light light in lights)
            {
                if (light.type == LightType.Directional)
                {
                    directionalLight = light;
                    break;
                }
            }
            if (directionalLight == null)
            {
                Debug.LogWarning("No directional light found in scene.");
            }
        }

        // Find all jellyfish materials in scene
        jellyfishMaterials = new List<JellyfishMaterial>(FindObjectsOfType<JellyfishMaterial>());

        // Update initial state
        UpdateDayNightCycle();
    }

    private void Update()
    {
        if (enableAutoTime)
        {
            timeElapsed += Time.deltaTime;
            timeOfDay = (timeElapsed / cycleDuration) % 1f;
            UpdateDayNightCycle();
        }
    }

    private void UpdateDayNightCycle()
    {
        // Update directional light
        if (directionalLight != null)
        {
            // Calculate light rotation based on time of day
            float lightAngle = timeOfDay * 360f - 90f; // -90f to start at top
            directionalLight.transform.rotation = Quaternion.Euler(lightAngle, 0f, 0f);

            // Calculate light intensity and color based on time of day
            float intensity;
            Color lightColor;

            if (timeOfDay > 0.2 && timeOfDay < 0.8) // Daytime (6am to 6pm)
            {
                intensity = 1.0f;
                lightColor = Color.white;
            }
            else // Nighttime
            {
                // Smooth transition
                float nightIntensity = 0.2f;
                if (timeOfDay <= 0.2)
                {
                    intensity = Mathf.Lerp(nightIntensity, 1.0f, timeOfDay / 0.2f);
                }
                else
                {
                    intensity = Mathf.Lerp(1.0f, nightIntensity, (timeOfDay - 0.8f) / 0.2f);
                }
                lightColor = new Color(0.8f, 0.9f, 1.0f); // Slightly blue at night
            }

            directionalLight.intensity = intensity;
            directionalLight.color = lightColor;
        }

        // Update all jellyfish materials
        foreach (var jellyfishMaterial in jellyfishMaterials)
        {
            jellyfishMaterial.UpdateEmissionBasedOnTime(timeOfDay);
        }
    }

    public void SetTimeOfDay(float newTimeOfDay)
    {
        timeOfDay = Mathf.Clamp01(newTimeOfDay);
        timeElapsed = timeOfDay * cycleDuration;
        UpdateDayNightCycle();
    }

    public void ToggleAutoTime()
    {
        enableAutoTime = !enableAutoTime;
    }

    // Add newly created jellyfish materials
    public void AddJellyfishMaterial(JellyfishMaterial jellyfishMaterial)
    {
        if (!jellyfishMaterials.Contains(jellyfishMaterial))
        {
            jellyfishMaterials.Add(jellyfishMaterial);
        }
    }
}
