using UnityEngine;
using System.Collections.Generic;
using System.IO;
using System;

[Serializable]
public class JellyfishData
{
    public string name;
    public string displayName;
    public float size;
    public float[] color;
    public float glowIntensity;
    public float transparency;
    public float speed;
    public string description;
}

[Serializable]
public class JellyfishCollection
{
    public List<JellyfishData> jellyfishes;
}

public class JellyfishDatabase : MonoBehaviour
{
    public string jsonFileName = "jellyfish.json";
    public bool loadFromStreamingAssets = true;
    public bool showDebugInfo = true;

    private JellyfishCollection jellyfishCollection;
    private Dictionary<string, JellyfishData> jellyfishDict;

    private void Awake()
    {
        LoadJellyfishData();
    }

    private void LoadJellyfishData()
    {
        string filePath;

        if (loadFromStreamingAssets)
        {
            filePath = Path.Combine(Application.streamingAssetsPath, jsonFileName);
        }
        else
        {
            filePath = Path.Combine(Application.dataPath, jsonFileName);
        }

        if (File.Exists(filePath))
        {
            try
            {
                string jsonContent = File.ReadAllText(filePath);
                jellyfishCollection = JsonUtility.FromJson<JellyfishCollection>(jsonContent);

                // Create dictionary for quick lookup
                jellyfishDict = new Dictionary<string, JellyfishData>();
                foreach (var jellyfish in jellyfishCollection.jellyfishes)
                {
                    jellyfishDict[jellyfish.name] = jellyfish;
                }

                if (showDebugInfo)
                {
                    Debug.Log($"Loaded {jellyfishCollection.jellyfishes.Count} jellyfish types from {filePath}");
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Error loading jellyfish data: {e.Message}");
            }
        }
        else
        {
            Debug.LogError($"Jellyfish data file not found: {filePath}");
        }
    }

    public JellyfishData GetJellyfishData(string jellyfishName)
    {
        if (jellyfishDict != null && jellyfishDict.ContainsKey(jellyfishName))
        {
            return jellyfishDict[jellyfishName];
        }
        else
        {
            Debug.LogWarning($"Jellyfish data not found for: {jellyfishName}");
            return null;
        }
    }

    public List<JellyfishData> GetAllJellyfishData()
    {
        return jellyfishCollection?.jellyfishes ?? new List<JellyfishData>();
    }

    public GameObject CreateJellyfish(string jellyfishName, Vector3 position)
    {
        JellyfishData data = GetJellyfishData(jellyfishName);
        if (data == null)
        {
            return null;
        }

        // Create a simple sphere as jellyfish
        GameObject jellyfish = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        jellyfish.name = data.displayName;
        jellyfish.transform.position = position;
        jellyfish.transform.localScale = Vector3.one * data.size;

        // Add JellyfishMaterial component
        JellyfishMaterial jellyfishMaterial = jellyfish.AddComponent<JellyfishMaterial>();
        jellyfishMaterial.jellyfishData = data;

        return jellyfish;
    }
}
