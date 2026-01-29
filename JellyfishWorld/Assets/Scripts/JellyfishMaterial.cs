using UnityEngine;

public class JellyfishMaterial : MonoBehaviour
{
    public Material jellyfishMaterial;
    public bool allowRuntimeUpdate = true;

    [HideInInspector]
    public JellyfishData jellyfishData;

    private float baseEmissionStrength;
    private Color baseColor;

    private void Start()
    {
        if (jellyfishMaterial == null)
        {
            // Try to get material from renderer
            Renderer renderer = GetComponent<Renderer>();
            if (renderer != null && renderer.material != null)
            {
                jellyfishMaterial = renderer.material;
            }
            else
            {
                Debug.LogWarning("No jellyfish material assigned.");
                return;
            }
        }

        // Store base values
        if (jellyfishMaterial.HasProperty("_EmissionStrength"))
        {
            baseEmissionStrength = jellyfishMaterial.GetFloat("_EmissionStrength");
        }

        if (jellyfishMaterial.HasProperty("_Color"))
        {
            baseColor = jellyfishMaterial.GetColor("_Color");
        }

        // Apply jellyfish data if available
        ApplyJellyfishData();
    }

    public void ApplyJellyfishData()
    {
        if (jellyfishData == null || jellyfishMaterial == null)
            return;

        // Set color
        if (jellyfishMaterial.HasProperty("_Color"))
        {
            Color jellyfishColor = new Color(
                jellyfishData.color[0],
                jellyfishData.color[1],
                jellyfishData.color[2],
                jellyfishData.transparency
            );
            jellyfishMaterial.SetColor("_Color", jellyfishColor);
        }

        // Set transparency
        if (jellyfishMaterial.HasProperty("_Opacity"))
        {
            jellyfishMaterial.SetFloat("_Opacity", jellyfishData.transparency);
        }

        // Set emission strength based on glow intensity
        if (jellyfishMaterial.HasProperty("_EmissionStrength"))
        {
            float emissionStrength = baseEmissionStrength * jellyfishData.glowIntensity;
            jellyfishMaterial.SetFloat("_EmissionStrength", emissionStrength);
        }
    }

    public void UpdateEmissionBasedOnTime(float timeOfDay)
    {
        if (!allowRuntimeUpdate || jellyfishMaterial == null || !jellyfishMaterial.HasProperty("_EmissionStrength"))
            return;

        // Time of day: 0 = midnight, 0.5 = noon, 1 = midnight
        float emissionMultiplier;

        if (timeOfDay > 0.2 && timeOfDay < 0.8) // Daytime (6am to 6pm)
        {
            // Reduce emission during the day
            emissionMultiplier = 0.3f;
        }
        else // Nighttime
        {
            // Increase emission at night
            emissionMultiplier = 1.5f;
        }

        if (jellyfishData != null)
        {
            float emissionStrength = baseEmissionStrength * jellyfishData.glowIntensity * emissionMultiplier;
            jellyfishMaterial.SetFloat("_EmissionStrength", emissionStrength);
        }
        else if (baseEmissionStrength > 0)
        {
            float emissionStrength = baseEmissionStrength * emissionMultiplier;
            jellyfishMaterial.SetFloat("_EmissionStrength", emissionStrength);
        }
    }
}
